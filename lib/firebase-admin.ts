import * as admin from 'firebase-admin';
import { cert, getApps } from 'firebase-admin/app';


export function initAdmin() {
  if (!getApps().length) {
    console.log('Initializing Firebase Admin...');
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
    
    if (!serviceAccount) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is missing from environment variables');
    }

    try {
      admin.initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('Firebase Admin initialized successfully');
    } catch (error) {
      console.error('Firebase Admin initialization failed:', error);
      throw error;
    }
  }
  
  return {
    adminDb: admin.firestore(),
    adminAuth: admin.auth()
  };
}
