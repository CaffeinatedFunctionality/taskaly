import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: any;

if (!adminApp) {
  // Check if we have service account credentials in environment
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (serviceAccount) {
    const parsed = JSON.parse(serviceAccount);
    adminApp = initializeApp({
      credential: cert(parsed),
    });
  } else {
    // Fallback to default app (works if initialized elsewhere)
    adminApp = initializeApp();
  }
}

export const adminDb = getFirestore(adminApp);