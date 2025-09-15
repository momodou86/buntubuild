
import * as admin from 'firebase-admin';

let adminAuth: admin.auth.Auth | undefined;

if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key must be enclosed in backticks or quotes in the .env file
      // to preserve the newlines. The replace is a fallback.
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    };

    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any),
        });
        adminAuth = admin.auth();
        console.log('Firebase Admin SDK initialized successfully from individual env vars.');
    } else {
        console.error('Firebase admin initialization failed: Required environment variables are missing.');
    }
    
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
  }
} else {
  adminAuth = admin.auth();
}

export { adminAuth };
