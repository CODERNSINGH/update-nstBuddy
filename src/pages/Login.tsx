import React from 'react';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';

const Login: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            NST Buddy
                        </h1>
                        <p className="text-gray-600">
                            Your companion for academic excellence
                        </p>
                    </div>

                    {/* Welcome Message */}
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                            Welcome Back!
                        </h2>
                        <p className="text-gray-600">
                            Sign in to access your assignments, questions, and more
                        </p>
                    </div>

                    {/* Google Sign In Button */}
                    <div className="flex justify-center mb-6">
                        <GoogleSignInButton />
                    </div>

                    {/* Features */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center mb-4">
                            What you'll get:
                        </p>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Access to all semester questions
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Course-wise organized content
                            </li>
                            <li className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                100 Days challenge tracker
                            </li>
                        </ul>
                    </div>

                    {/* Privacy Note */}
                    <p className="mt-6 text-xs text-gray-500 text-center">
                        By signing in, you agree to our Terms of Service and Privacy Policy.
                        We only access your basic profile information.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
