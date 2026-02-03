import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCOIRfpW1k-0Xsqv1g9zZgLtBVpLq3c334",
    authDomain: "nstbuddy-1fe6f.firebaseapp.com",
    projectId: "nstbuddy-1fe6f",
    storageBucket: "nstbuddy-1fe6f.firebasestorage.app",
    messagingSenderId: "284279691898",
    appId: "1:284279691898:web:cd3b2d320cd61b0788f9c3",
    measurementId: "G-D5MEFFH08E"
};

console.log('🔥 Initializing Firebase with config:', {
    apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Set persistence to LOCAL (survives browser restarts)
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log('✅ Firebase persistence set to LOCAL');
    })
    .catch((error) => {
        console.error('❌ Error setting Firebase persistence:', error);
    });

export const googleProvider = new GoogleAuthProvider();
// Force account selection every time
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export default app;
