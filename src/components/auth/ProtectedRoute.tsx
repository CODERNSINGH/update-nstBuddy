import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    console.log('🔒 ProtectedRoute check:', {
        path: location.pathname,
        requireAdmin,
        user: user ? { email: user.email, isAdmin: user.isAdmin } : null,
        loading
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) {
        console.log('❌ No user, redirecting to login');
        // Redirect to login page, but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !user.isAdmin) {
        console.log('❌ User is not admin, showing access denied');
        // User is logged in but not an admin
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                    <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    console.log('✅ Access granted');
    return <>{children}</>;
};

export default ProtectedRoute;
