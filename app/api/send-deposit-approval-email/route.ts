
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { DepositApprovalEmail } from '@/emails/DepositApprovalEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { to, amount, asset, transactionLink, transactionId } = await req.json();

  try {
    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to,
      subject: 'Your Deposit has been Approved',
      react: DepositApprovalEmail({
        amount,
        asset,
        transactionLink,
        transactionId,
      }),
    });

    return NextResponse.json({ message: 'Deposit approval email sent successfully' });
  } catch (error) {
    console.error('Error sending deposit approval email:', error);
    return NextResponse.json({ error: 'Failed to send deposit approval email' }, { status: 500 });
  }
}
