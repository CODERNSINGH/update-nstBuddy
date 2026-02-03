import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin SDK
// Priority: Environment variables > Service account JSON file
if (!admin.apps.length) {
    let firebaseConfig;

    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        // Use environment variables (for production deployment)
        console.log('🔥 Initializing Firebase Admin SDK with environment variables');
        firebaseConfig = {
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            })
        };
    } else {
        // Fall back to service account JSON file (for local development)
        console.log('🔥 Initializing Firebase Admin SDK with service account file');
        const serviceAccountPath = join(__dirname, '../../firebase-service-account.json');

        if (!fs.existsSync(serviceAccountPath)) {
            throw new Error('❌ Firebase service account file not found and environment variables not set!');
        }

        const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
        firebaseConfig = {
            credential: admin.credential.cert(serviceAccount)
        };
    }

    admin.initializeApp(firebaseConfig);
    console.log('✅ Firebase Admin SDK initialized successfully');
}

export const auth = admin.auth();
export default admin;
