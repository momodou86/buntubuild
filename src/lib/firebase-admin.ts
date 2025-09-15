import * as admin from 'firebase-admin';

let adminAuth: admin.auth.Auth | undefined;

if (!admin.apps.length) {
  try {
    // This is the recommended way for authenticating on a local dev server.
    // This relies on the GOOGLE_APPLICATION_CREDENTIALS env var.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    adminAuth = admin.auth();
    console.log('Firebase Admin SDK initialized successfully via Application Default Credentials.');
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    if (process.env.NODE_ENV === 'development' && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.warn(
          '\n\n*** FIREBASE ADMIN INIT FAILED ***\n' +
          'The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.\n' +
          'Admin features will be disabled.\n' +
          'See instructions in /src/app/(app)/admin/users/page.tsx to resolve this.\n'
        );
    } else {
       console.error('Full error object:', JSON.stringify(error, null, 2));
    }
  }
} else {
  adminAuth = admin.auth();
}

export { adminAuth };
