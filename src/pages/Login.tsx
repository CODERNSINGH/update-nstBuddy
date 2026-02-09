import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Login: React.FC = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to home if already logged in
    useEffect(() => {
        if (!loading && user) {
            // Get the page they were trying to visit, or default to home
            const from = (location.state as any)?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [user, loading, navigate, location]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // Don't show login page if user is already authenticated
    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                    {/* Logo/Brand */}
                    <div className="mb-8">
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                            NST Buddy
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Your academic companion
                        </p>
                    </div>

                    {/* Welcome Message */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                            Welcome!
                        </h2>
                        <p className="text-gray-600">
                            Sign in to continue
                        </p>
                    </div>

                    {/* Google Sign In Button */}
                    <div className="flex justify-center">
                        <GoogleSignInButton />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
