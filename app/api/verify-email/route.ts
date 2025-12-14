import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  try {
    const { adminDb } = initAdmin();
    const usersRef = adminDb.collection('users');
    const querySnapshot = await usersRef.where('verificationToken', '==', code).get();

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    if (userData.verificationTokenExpires < Date.now()) {
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    await userDoc.ref.update({
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });

    const { email, displayName } = userData;

    return NextResponse.json({ message: 'Email verified successfully', user: { email, displayName } });
  } catch (error: any) {
    console.error('Error verifying email:', error);
    return NextResponse.json({ error: error.message || 'Failed to verify email' }, { status: 500 });
  }
}
