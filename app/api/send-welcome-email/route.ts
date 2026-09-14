
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome-email';
import {
  checkRateLimit,
  getClientIp,
  tooManyRequests,
} from '@/lib/rate-limit';
import { requireUser } from '@/lib/require-auth';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // Signed-in callers only (post-verification sending now happens
  // server-side inside /api/verify-email).
  const authed = await requireUser(req);
  if ('error' in authed) return authed.error;

  const ipLimit = checkRateLimit(
    `send-welcome-email:ip:${getClientIp(req)}`,
    30,
    60 * 60 * 1000
  );
  if (!ipLimit.allowed) return tooManyRequests(ipLimit.resetAfterMs);

  const { email, name } = await req.json();

  if (!email || !name) {
    return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
  }

  try {
    await resend.emails.send({
      from: 'Bytexp2p <admin@bytexp2p.com>',
      to: email,
      subject: 'Welcome to Bytexp2p',
      react: WelcomeEmail({ name }),
    });

    return NextResponse.json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return NextResponse.json({ error: 'Failed to send welcome email' }, { status: 500 });
  }
}
