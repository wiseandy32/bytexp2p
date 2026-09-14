import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';

const INVALID_CODE_ERROR = 'Invalid or expired reset code.';

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

    if (
      !userData?.passwordResetToken ||
      userData.passwordResetToken !== String(code).trim() ||
      !userData.passwordResetTokenExpires ||
      userData.passwordResetTokenExpires < Date.now()
    ) {
      return NextResponse.json({ error: INVALID_CODE_ERROR }, { status: 400 });
    }

    await adminAuth.updateUser(userRecord.uid, { password: newPassword });

    // Single-use: clear the code so it can't be replayed.
    await userDoc.ref.update({
      passwordResetToken: null,
      passwordResetTokenExpires: null,
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
