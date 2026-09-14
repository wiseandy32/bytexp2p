import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import { Resend } from 'resend';
import ForgotPasswordEmail from '@/emails/forgot-password-email';
import { render, pretty } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);
const RESET_CODE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generic message returned whether or not the account exists,
// so the endpoint can't be used to enumerate registered emails.
const GENERIC_SUCCESS =
  'If an account exists for this email, a password reset code has been sent.';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { adminAuth, adminDb } = initAdmin();

    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(normalizedEmail);
    } catch {
      // Unknown email: same response, no email sent.
      return NextResponse.json({ message: GENERIC_SUCCESS });
    }

    const resetCode = generateResetCode();

    await adminDb.collection('users').doc(userRecord.uid).set(
      {
        passwordResetToken: resetCode,
        passwordResetTokenExpires: Date.now() + RESET_CODE_TTL_MS,
      },
      { merge: true }
    );

    const emailHtml = await pretty(
      await render(
        ForgotPasswordEmail({
          name: userRecord.displayName || 'there',
          resetCode,
          expiresInMinutes: 15,
        })
      )
    );

    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to: normalizedEmail,
      subject: 'Reset your Bytexp2p password',
      html: emailHtml,
    });

    return NextResponse.json({ message: GENERIC_SUCCESS });
  } catch (error: unknown) {
    console.error('Error sending password reset email:', error);
    return NextResponse.json(
      { error: 'Failed to send password reset email' },
      { status: 500 }
    );
  }
}
