import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';

async function verifyAdmin(req: NextRequest) {
  const { adminAuth, adminDb } = initAdmin();
  
  // Get the ID token from the Authorization header
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 }) };
  }
  const token = authHeader.split('Bearer ')[1];

  // Verify the token
  const decodedToken = await adminAuth.verifyIdToken(token);
  const requesterUid = decodedToken.uid;

  // Verify the requester is an admin in Firestore
  const requesterDoc = await adminDb.collection('users').doc(requesterUid).get();
  if (!requesterDoc.exists || !requesterDoc.data()?.isAdmin) {
    return { error: NextResponse.json({ error: 'Forbidden: Requester is not an admin' }, { status: 403 }) };
  }

  return { adminAuth, adminDb };
}

export async function PUT(req: NextRequest) {
  try {
    const result = await verifyAdmin(req);
    if ('error' in result) {
      return result.error;
    }
    const { adminDb } = result;

    const body = await req.json();
    const { userId, isAdmin } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Update Firestore document
    await adminDb.collection('users').doc(userId).update({ isAdmin });

    return NextResponse.json({ success: true, message: `User role updated to ${isAdmin ? 'admin' : 'user'}` });
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const result = await verifyAdmin(req);
    if ('error' in result) {
      return result.error;
    }
    const { adminAuth, adminDb } = result;

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Delete user from Authentication
    await adminAuth.deleteUser(userId);

    // Delete user from Firestore
    await adminDb.collection('users').doc(userId).delete();

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
