var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}


export const adminAuth = admin.apps.length ? admin.auth() : undefined;
