
import * as admin from 'firebase-admin';

let adminAuth: admin.auth.Auth | undefined;

if (!admin.apps.length) {
  try {
    // This is the recommended way when using GOOGLE_APPLICATION_CREDENTIALS
    // The SDK will automatically find the file from the env var.
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
    });
    adminAuth = admin.auth();
    console.log('Firebase Admin SDK initialized successfully.');

  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    // We don't throw here, so the app can still run and show the error UI.
  }
} else {
  adminAuth = admin.auth();
}

export { adminAuth };
