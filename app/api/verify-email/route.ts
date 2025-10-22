
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  try {
    const q = query(collection(db, 'users'), where('verificationToken', '==', code));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.verificationTokenExpires < Date.now()) {
      return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 });
    }

    const batch = writeBatch(db);
    batch.update(userDoc.ref, { 
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
     });
    await batch.commit();

    return NextResponse.json({ message: 'Email verified successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 });
  }
}
