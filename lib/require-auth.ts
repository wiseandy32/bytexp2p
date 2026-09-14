import { NextRequest, NextResponse } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

interface AuthedContext {
  uid: string;
  token: DecodedIdToken;
  adminAuth: ReturnType<typeof initAdmin>['adminAuth'];
  adminDb: ReturnType<typeof initAdmin>['adminDb'];
}

/** Verifies the Bearer ID token. Returns the context or `{ error }` response. */
export async function requireUser(
  req: NextRequest
): Promise<AuthedContext | { error: NextResponse }> {
  const { adminAuth, adminDb } = initAdmin();

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized: Missing token' },
        { status: 401 }
      ),
    };
  }
  const token = authHeader.split('Bearer ')[1];

  let decoded: DecodedIdToken;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized: Invalid token' },
        { status: 401 }
      ),
    };
  }

  return { uid: decoded.uid, token: decoded, adminAuth, adminDb };
}

/** Verifies the Bearer ID token AND that the caller is an admin in Firestore. */
export async function requireAdmin(
  req: NextRequest
): Promise<AuthedContext | { error: NextResponse }> {
  const result = await requireUser(req);
  if ('error' in result) return result;

  const requesterDoc = await result.adminDb
    .collection('users')
    .doc(result.uid)
    .get();
  if (!requesterDoc.exists || !requesterDoc.data()?.isAdmin) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden: Requester is not an admin' },
        { status: 403 }
      ),
    };
  }

  return result;
}
