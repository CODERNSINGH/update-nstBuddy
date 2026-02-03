import React, { createContext, useContext, useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { authAPI } from '../services/auth';

interface User {
    id: string;
    firebaseUid: string;
    email: string;
    name: string;
    picture?: string;
    isPro: boolean;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);



    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            console.log('🔄 Auth state changed:', firebaseUser ? 'User logged in' : 'No user');

            if (firebaseUser) {
                try {
                    // Get Firebase ID token
                    const idToken = await firebaseUser.getIdToken();

                    console.log('🔑 Got Firebase token, verifying with backend...');

                    // Verify token with backend and get/create user
                    const response = await authAPI.verifyToken(idToken);

                    if (response.success && response.user) {
                        console.log('✅ User verified and set:', response.user.email);
                        setUser(response.user);
                    } else {
                        console.log('❌ Backend verification failed');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('❌ Error verifying token:', error);
                    setUser(null);
                }
            } else {
                console.log('👤 No Firebase user, clearing user state');
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        try {
            console.log('🚀 Login button clicked, initiating Google sign-in popup...');
            console.log('📍 Current URL:', window.location.href);

            setLoading(true);

            // Use popup for local development
            const result = await signInWithPopup(auth, googleProvider);
            console.log('✅ Sign-in successful!', result.user.email);

            // onAuthStateChanged will handle the rest
        } catch (error: any) {
            console.error('❌ Login error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);

            // Handle specific errors
            if (error.code === 'auth/popup-closed-by-user') {
                console.log('ℹ️ User closed the popup');
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log('ℹ️ Popup request cancelled');
            } else if (error.code === 'auth/popup-blocked') {
                alert('Popup was blocked by your browser. Please allow popups for this site.');
            }

            setLoading(false);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            await authAPI.logout();
            setUser(null);
            window.location.href = '/login';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const refreshUser = async () => {
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
            try {
                const idToken = await firebaseUser.getIdToken(true); // Force refresh
                const response = await authAPI.verifyToken(idToken);
                if (response.success && response.user) {
                    setUser(response.user);
                }
            } catch (error) {
                console.error('Error refreshing user:', error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
