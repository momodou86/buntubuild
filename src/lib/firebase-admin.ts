
var admin = require("firebase-admin");

if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (!privateKey) {
        // In a deployed environment, you might not want to throw an error
        // but log it and disable admin features. For development, throwing is fine.
        console.error("The FIREBASE_PRIVATE_KEY environment variable is not set. Admin features will be disabled.");
    } else {
        try {
            admin.initializeApp({
              credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey.replace(/\\n/g, '\n'),
              }),
            });
        } catch (error: any) {
            console.error("Firebase admin initialization error:", error.message);
        }
    }
}


export const adminAuth = admin.apps.length ? admin.auth() : undefined;
