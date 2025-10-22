
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
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

    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      verificationToken: verificationCode,
      verificationTokenExpires: verificationTokenExpires,
    });

    const emailHtml = await pretty(await render(VerificationEmail({ verificationCode })));

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email address',
      html: emailHtml,
    });

    return NextResponse.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error)
    // return NextResponse.json({ error: 'Failed to send verification email' }, { status: 400 });
  }
}
