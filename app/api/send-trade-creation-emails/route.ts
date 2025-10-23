
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { TradeCreationCreatorEmail } from '@/emails/TradeCreationCreatorEmail';
import { TradeCreationParticipantEmail } from '@/emails/TradeCreationParticipantEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const {
    roomId,
    creatorRole,
    participantRole,
    sellerAmount,
    sellersToken,
    buyerAmount,
    buyersToken,
    tradeLink,
    creatorEmail,
    participantEmail,
  } = await req.json();

  try {
    // Send email to the trade creator
    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to: creatorEmail,
      subject: 'You have created a new trade',
      react: TradeCreationCreatorEmail({
        roomId,
        traderRole: creatorRole,
        sellerAmount,
        sellersToken,
        buyerAmount,
        buyersToken,
        tradeLink,
      }),
    });

    // Send email to the trade participant
    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to: participantEmail,
      subject: 'You have been invited to a new trade',
      react: TradeCreationParticipantEmail({
        roomId,
        traderRole: participantRole,
        sellerAmount,
        sellersToken,
        buyerAmount,
        buyersToken,
        tradeLink,
      }),
    });

    return NextResponse.json({ message: 'Trade creation emails sent successfully' });
  } catch (error) {
    console.error('Error sending trade creation emails:', error);
    return NextResponse.json({ error: 'Failed to send trade creation emails' }, { status: 500 });
  }
}
