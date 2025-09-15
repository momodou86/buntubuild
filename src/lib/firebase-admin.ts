
'use server';

import * as admin from 'firebase-admin';

let adminAuth: admin.auth.Auth | undefined;

if (!admin.apps.length) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn(
      'Firebase Admin SDK environment variables are not fully set. Admin features will be disabled.'
    );
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          // The 'replace' is crucial for handling the private key from a .env file
          privateKey: privateKey.replace(/\\n/g, '\n'),
        }),
      });
      adminAuth = admin.auth();
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase admin initialization error:', error.message);
      // Log the detailed error object for better debugging
      console.error('Full error object:', JSON.stringify(error, null, 2));
    }
  }
} else {
  adminAuth = admin.auth();
}

export { adminAuth };
