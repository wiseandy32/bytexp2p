import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome-email';
import {
  checkRateLimit,
  getClientIp,
  tooManyRequests,
} from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  // Strict per-IP throttle: codes are short-lived numeric strings.
  // (No auth here by design: freshly registered users verify while signed
  // out. The code delivered to their inbox is the capability.)
  const ipLimit = checkRateLimit(
    `verify-email:ip:${getClientIp(req)}`,
    15,
    10 * 60 * 1000
  );
  if (!ipLimit.allowed) return tooManyRequests(ipLimit.resetAfterMs);

  try {
    const { adminDb } = initAdmin();
    const usersRef = adminDb.collection('users');
    const querySnapshot = await usersRef.where('verificationToken', '==', code).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (typeof userData.verificationTokenExpires !== 'number' || userData.verificationTokenExpires < Date.now()) {
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    await userDoc.ref.update({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });

    const { email, displayName } = userData;

    // Welcome email, sent server-side on first successful verification.
    try {
      if (email) {
        await resend.emails.send({
          from: 'Bytexp2p <admin@bytexp2p.com>',
          to: email,
          subject: 'Welcome to Bytexp2p',
          react: WelcomeEmail({ name: displayName || 'there' }),
        });
      }
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    return NextResponse.json({ message: 'Email verified successfully', user: { email, displayName } });
  } catch (error: unknown) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
  }
}
