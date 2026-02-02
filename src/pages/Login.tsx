import React from 'react';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const Login: React.FC = () => {
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
