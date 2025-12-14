
import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import { Resend } from 'resend';
import VerificationEmail from '@/emails/verification-email';
import { render, pretty } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: NextRequest) {
  const { email, uid } = await req.json();

  if (!uid || !email) {
    return NextResponse.json({ error: 'Missing uid or email' }, { status: 400 });
  }

  const verificationCode = generateVerificationCode();
  const verificationTokenExpires = Date.now() + 600000; // 10 minutes

  try {
    const { adminDb } = initAdmin();
    
    await adminDb.collection('users').doc(uid).update({
      verificationToken: verificationCode,
      verificationTokenExpires: verificationTokenExpires,
    });

    const emailHtml = await pretty(await render(VerificationEmail({ verificationCode })));

    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to: email,
      subject: 'Verify your email address',
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Verification email sent' });
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send verification email' }, { status: 500 });
  }
}
