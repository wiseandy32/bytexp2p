import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WithdrawalApprovalEmail } from '@/emails/WithdrawalApprovalEmail';
import {
  checkRateLimit,
  getClientIp,
  tooManyRequests,
} from '@/lib/rate-limit';
import { requireAdmin } from '@/lib/require-auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // Admins only: the recipient and amounts are derived server-side from
  // the transaction so callers can't spoof approval emails.
  const authed = await requireAdmin(req);
  if ('error' in authed) return authed.error;

  const ipLimit = checkRateLimit(
    `send-withdrawal-approval-email:ip:${getClientIp(req)}`,
    30,
    60 * 60 * 1000
  );
  if (!ipLimit.allowed) return tooManyRequests(ipLimit.resetAfterMs);

  // transactionLink is display-only; everything else comes from Firestore.
  const { transactionId, transactionLink } = await req.json();
  if (!transactionId) {
    return NextResponse.json(
      { error: 'transactionId is required' },
      { status: 400 }
    );
  }

  try {
    const txSnap = await authed.adminDb
      .collection('transactions')
      .doc(String(transactionId))
      .get();
    if (!txSnap.exists) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }
    const tx = txSnap.data()!;
    if (tx.type !== 'withdrawal') {
      return NextResponse.json(
        { error: 'Transaction is not a withdrawal' },
        { status: 400 }
      );
    }

    const userSnap = await authed.adminDb
      .collection('users')
      .doc(String(tx.userId))
      .get();
    const userData = userSnap.data();
    if (!userData?.email) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to: userData.email,
      subject: 'Your Withdrawal has been Approved',
      react: WithdrawalApprovalEmail({
        name: userData.displayName || 'there',
        amount: tx.amount,
        asset: tx.token?.shortName,
        transactionLink,
        transactionId,
      }),
    });

    return NextResponse.json({ message: 'Withdrawal approval email sent successfully' });
  } catch (error) {
    console.error('Error sending withdrawal approval email:', error);
    return NextResponse.json({ error: 'Failed to send withdrawal approval email' }, { status: 500 });
  }
}
