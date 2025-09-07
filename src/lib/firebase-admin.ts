import admin from 'firebase-admin';
import serviceAccount from '../../../serviceAccountKey.json';

// The type assertion is necessary because the JSON file is not available at build time for type inference.
const typedServiceAccount = serviceAccount as {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
};


if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(typedServiceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}

export const adminAuth = admin.apps.length ? admin.auth() : undefined;
