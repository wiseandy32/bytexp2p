import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/require-auth';

export async function PUT(req: NextRequest) {
  try {
    const result = await requireAdmin(req);
    if ('error' in result) {
      return result.error;
    }
    const { adminDb } = result;

    const body = await req.json();
    const { userId, isAdmin } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (typeof isAdmin !== 'boolean') {
      return NextResponse.json(
        { error: 'isAdmin must be a boolean' },
        { status: 400 }
      );
    }

    if (userId === result.uid) {
      return NextResponse.json(
        { error: 'You cannot change your own admin role' },
        { status: 400 }
      );
    }

    const targetDoc = await adminDb.collection('users').doc(userId).get();
    if (!targetDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update Firestore document
    await adminDb.collection('users').doc(userId).update({ isAdmin });

    return NextResponse.json({ success: true, message: `User role updated to ${isAdmin ? 'admin' : 'user'}` });
  } catch (error: unknown) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const result = await requireAdmin(req);
    if ('error' in result) {
      return result.error;
    }
    const { adminAuth, adminDb } = result;

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    if (userId === result.uid) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user from Authentication
    await adminAuth.deleteUser(userId);

    // Delete user from Firestore
    await adminDb.collection('users').doc(userId).delete();

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
