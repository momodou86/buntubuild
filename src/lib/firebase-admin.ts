
import * as admin from 'firebase-admin';

let adminAuth: admin.auth.Auth | undefined;

if (!admin.apps.length) {
  try {
    // Check if the environment variable is set and parse it
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      const serviceAccount = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
      
      // Manually replace escaped newlines in the private key
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      adminAuth = admin.auth();
      console.log('Firebase Admin SDK initialized successfully from env var.');
    } else {
      // Fallback for local development if service-account.json is used
      admin.initializeApp();
      adminAuth = admin.auth();
      console.log('Firebase Admin SDK initialized with default credentials.');
    }
  } catch (error: any) {
    console.error('Firebase admin initialization error:', error.message);
    // Log the credential being used for debugging if it exists
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      // Avoid logging the full sensitive key
      console.error("Error occurred with service account credentials from environment variables.");
    }
  }
} else {
  adminAuth = admin.auth();
}

export { adminAuth };
