import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { TradeCreationCreatorEmail } from '@/emails/TradeCreationCreatorEmail';
import { TradeCreationParticipantEmail } from '@/emails/TradeCreationParticipantEmail';
import TradeInviteUnregisteredEmail from '@/emails/TradeInviteUnregisteredEmail';
import {
  checkRateLimit,
  getClientIp,
  tooManyRequests,
} from '@/lib/rate-limit';
import { requireUser } from '@/lib/require-auth';

const resend = new Resend(process.env.RESEND_API_KEY);

// Abuse gates for invites to addresses with no account (anyone's email can
// be typed into the trade form):
const MAX_INVITES_PER_RECIPIENT = 3; // per window below
const RECIPIENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_INVITES_PER_SENDER = 3; // per window below
const SENDER_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const INVITE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const INVITE_EXPIRY_HOURS = 24;

const tokenDisplayName = (token: unknown): string => {
  if (typeof token === 'string') return token;
  if (token && typeof token === 'object' && 'name' in token) {
    return String((token as { name: unknown }).name);
  }
  return '';
};

export async function POST(req: NextRequest) {
  // The caller must be signed in AND be the creator of the trade. All
  // email content is derived server-side from the stored trade so
  // callers can't spoof trade details.
  const authed = await requireUser(req);
  if ('error' in authed) return authed.error;

  const ipLimit = checkRateLimit(
    `send-trade-creation-emails:ip:${getClientIp(req)}`,
    30,
    60 * 60 * 1000
  );
  if (!ipLimit.allowed) return tooManyRequests(ipLimit.resetAfterMs);

  // tradeLink is display-only; everything else comes from Firestore.
  const { roomId, tradeLink: clientTradeLink } = await req.json();
  if (!roomId) {
    return NextResponse.json({ error: 'roomId is required' }, { status: 400 });
  }

  try {
    const tradeSnap = await authed.adminDb
      .collection('trades')
      .where('roomId', '==', String(roomId))
      .limit(1)
      .get();
    if (tradeSnap.empty) {
      return NextResponse.json({ error: 'Trade not found' }, { status: 404 });
    }
    const trade = tradeSnap.docs[0].data();
    if (trade.creatorId !== authed.uid) {
      return NextResponse.json(
        { error: 'Forbidden: only the trade creator can send these emails' },
        { status: 403 }
      );
    }

    const creatorEmail = authed.token.email;
    if (!creatorEmail) {
      return NextResponse.json(
        { error: 'Signed-in user has no email' },
        { status: 400 }
      );
    }
    const creatorRole = trade.traderRole;
    const participantRole = creatorRole === 'seller' ? 'buyer' : 'seller';
    const participantEmail =
      creatorRole === 'seller' ? trade.buyerEmail : trade.sellerEmail;
    if (!participantEmail) {
      return NextResponse.json(
        { error: 'Trade has no counterparty email' },
        { status: 400 }
      );
    }

    // Prefer a server-derived link so clients can't point victims elsewhere.
    const referer = req.headers.get('referer');
    let siteOrigin = '';
    try {
      siteOrigin = referer ? new URL(referer).origin : '';
    } catch {
      siteOrigin = '';
    }
    const tradeLink = siteOrigin
      ? `${siteOrigin}/dashboard/view-room/${trade.roomId}`
      : clientTradeLink;

    const sellerAmount = trade.sellerAmount;
    const buyerAmount = trade.buyerAmount;
    const sellersToken = tokenDisplayName(trade.sellersToken);
    const buyersToken = tokenDisplayName(trade.buyersToken);

    // Send email to the trade creator
    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to: creatorEmail,
      subject: 'You have created a new trade',
      react: TradeCreationCreatorEmail({
        roomId: trade.roomId,
        traderRole: creatorRole,
        sellerAmount,
        sellersToken,
        buyerAmount,
        buyersToken,
        tradeLink,
      }),
    });

    // Counterparty invite: registered users get the standard invitation.
    let participantRegistered = true;
    try {
      await authed.adminAuth.getUserByEmail(participantEmail);
    } catch {
      participantRegistered = false;
    }

    if (participantRegistered) {
      await resend.emails.send({
        from: 'Bytexp2p <admin@bytexp2p.com>',
        to: participantEmail,
        subject: 'You have been invited to a new trade',
        react: TradeCreationParticipantEmail({
          roomId: trade.roomId,
          traderRole: participantRole,
          sellerAmount,
          sellersToken,
          buyerAmount,
          buyersToken,
          tradeLink,
        }),
      });
      return NextResponse.json({
        message: 'Trade creation emails sent successfully',
        participantEmailSent: true,
      });
    }

    // Unregistered counterparty: gated onboarding invite. Throttle per
    // recipient (don't hammer one victim) and per sender (don't let one
    // account spray invites), and record the invite with an expiry that is
    // enforced when they try to join.
    const now = Date.now();
    const invitesRef = authed.adminDb.collection('tradeInvites');
    const [recipientInvites, senderInvites] = await Promise.all([
      invitesRef
        .where('recipientEmail', '==', String(participantEmail).toLowerCase())
        .get(),
      invitesRef.where('senderUid', '==', authed.uid).get(),
    ]);
    const recentForRecipient = recipientInvites.docs.filter(
      (d) => (d.data().createdAtMs ?? 0) > now - RECIPIENT_WINDOW_MS
    ).length;
    if (recentForRecipient >= MAX_INVITES_PER_RECIPIENT) {
      return NextResponse.json({
        message: 'Trade creation emails sent successfully',
        participantEmailSent: false,
        inviteSkippedReason: 'recipient_limit' as const,
      });
    }
    const recentForSender = senderInvites.docs.filter(
      (d) => (d.data().createdAtMs ?? 0) > now - SENDER_WINDOW_MS
    ).length;
    if (recentForSender >= MAX_INVITES_PER_SENDER) {
      return NextResponse.json({
        message: 'Trade creation emails sent successfully',
        participantEmailSent: false,
        inviteSkippedReason: 'sender_limit' as const,
      });
    }

    // Deep link: after registering they land straight in the trade room.
    const signupLink = siteOrigin
      ? `${siteOrigin}/auth/register?next=${encodeURIComponent(`/dashboard/view-room/${trade.roomId}`)}`
      : clientTradeLink;

    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to: participantEmail,
      subject: "You've been invited to a crypto trade on Bytexp2p",
      react: TradeInviteUnregisteredEmail({
        roomId: trade.roomId,
        participantRole,
        sellerAmount: String(sellerAmount ?? ''),
        sellersToken,
        buyerAmount: String(buyerAmount ?? ''),
        buyersToken,
        signupLink,
        expiresInHours: INVITE_EXPIRY_HOURS,
      }),
    });

    await invitesRef.add({
      roomId: trade.roomId,
      recipientEmail: String(participantEmail).toLowerCase(),
      senderUid: authed.uid,
      createdAtMs: now,
      expiresAtMs: now + INVITE_EXPIRY_MS,
    });

    return NextResponse.json({
      message: 'Trade creation emails sent successfully',
      participantEmailSent: true,
      inviteSentToUnregistered: true,
    });
  } catch (error) {
    console.error('Error sending trade creation emails:', error);
    return NextResponse.json({ error: 'Failed to send trade creation emails' }, { status: 500 });
  }
}
