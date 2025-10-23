
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WithdrawalApprovalEmail } from '@/emails/WithdrawalApprovalEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { to, name, amount, asset, transactionLink, transactionId } = await req.json();

  try {
    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to,
      subject: 'Your Withdrawal has been Approved',
      react: WithdrawalApprovalEmail({
        name,
        amount,
        asset,
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
