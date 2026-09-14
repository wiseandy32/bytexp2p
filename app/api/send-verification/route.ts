
import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import { Resend } from 'resend';
import VerificationEmail from '@/emails/verification-email';
import { render, pretty } from '@react-email/render';
import {
  checkRateLimit,
  getClientIp,
  tooManyRequests,
} from '@/lib/rate-limit';
import { requireUser } from '@/lib/require-auth';

const resend = new Resend(process.env.RESEND_API_KEY);
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: NextRequest) {
  const { email, uid } = await req.json();

  if (!uid || !email) {
    return NextResponse.json({ error: 'Missing uid or email' }, { status: 400 });
  }

  // The caller must be signed in as the account the code is issued for —
  // otherwise anyone could overwrite anyone else's verification code.
  const authed = await requireUser(req);
  if ('error' in authed) return authed.error;
  if (authed.uid !== uid) {
    return NextResponse.json(
      { error: 'Forbidden: uid does not match signed-in user' },
      { status: 403 }
    );
  }
  const accountEmail = authed.token.email?.toLowerCase();
  if (!accountEmail || accountEmail !== String(email).trim().toLowerCase()) {
    return NextResponse.json(
      { error: 'Email does not match signed-in user' },
      { status: 400 }
    );
  }

  // Throttle code (re)generation: per-IP and per targeted account.
  const ipLimit = checkRateLimit(
    `send-verification:ip:${getClientIp(req)}`,
    10,
    60 * 60 * 1000
  );
  if (!ipLimit.allowed) return tooManyRequests(ipLimit.resetAfterMs);
  const targetLimit = checkRateLimit(
    `send-verification:uid:${uid}`,
    5,
    60 * 60 * 1000
  );
  if (!targetLimit.allowed) return tooManyRequests(targetLimit.resetAfterMs);

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
