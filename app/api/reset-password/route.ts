import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import {
  checkRateLimit,
  getClientIp,
  tooManyRequests,
} from '@/lib/rate-limit';

const INVALID_CODE_ERROR = 'Invalid or expired reset code.';
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30 * 60 * 1000; // 30 minutes

export async function POST(req: NextRequest) {
  const { email, code, newPassword } = await req.json();

  if (!email || !code || !newPassword) {
    return NextResponse.json(
      { error: 'Email, reset code and new password are required' },
      { status: 400 }
    );
  }

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return NextResponse.json(
      { error: 'New password must be at least 6 characters long' },
      { status: 400 }
    );
  }

  // Per-IP throttle (the per-account lockout below is the real brute-force guard).
  const ipLimit = checkRateLimit(
    `reset-password:ip:${getClientIp(req)}`,
    30,
    60 * 60 * 1000
  );
  if (!ipLimit.allowed) return tooManyRequests(ipLimit.resetAfterMs);

  try {
    const { adminAuth, adminDb } = initAdmin();

    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(
        String(email).trim().toLowerCase()
      );
    } catch {
      return NextResponse.json({ error: INVALID_CODE_ERROR }, { status: 400 });
    }

    const userDoc = await adminDb
      .collection('users')
      .doc(userRecord.uid)
      .get();
    const userData = userDoc.data();

    // Persistent brute-force lockout (survives restarts / multiple instances).
    if (
      typeof userData?.passwordResetLockedUntil === 'number' &&
      userData.passwordResetLockedUntil > Date.now()
    ) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(
              Math.max(
                1,
                Math.ceil(
                  (userData.passwordResetLockedUntil - Date.now()) / 1000
                )
              )
            ),
          },
        }
      );
    }

    if (
      !userData?.passwordResetToken ||
      userData.passwordResetToken !== String(code).trim() ||
      !userData.passwordResetTokenExpires ||
      userData.passwordResetTokenExpires < Date.now()
    ) {
      const attempts = (userData?.passwordResetAttempts ?? 0) + 1;
      await userDoc.ref.set(
        {
          passwordResetAttempts: attempts,
          ...(attempts >= MAX_ATTEMPTS
            ? { passwordResetLockedUntil: Date.now() + LOCK_MS }
            : {}),
        },
        { merge: true }
      );
      return NextResponse.json({ error: INVALID_CODE_ERROR }, { status: 400 });
    }

    await adminAuth.updateUser(userRecord.uid, { password: newPassword });

    // Single-use: clear the code so it can't be replayed.
    await userDoc.ref.update({
      passwordResetToken: null,
      passwordResetTokenExpires: null,
      passwordResetAttempts: 0,
      passwordResetLockedUntil: null,
    });

    return NextResponse.json({
      message: 'Password reset successfully. Please log in with your new password.',
    });
  } catch (error: unknown) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
