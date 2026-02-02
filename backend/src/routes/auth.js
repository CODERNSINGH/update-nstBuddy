import express from 'express';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Initiate Google OAuth login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`
    }),
    (req, res) => {
        // Successful authentication, redirect to frontend
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?success=true`);
    }
);

// Get current authenticated user
router.get('/current-user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            success: true,
            user: req.user
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Not authenticated'
        });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: 'Session destruction failed' });
            }
            res.clearCookie('connect.sid');
            res.json({ success: true, message: 'Logged out successfully' });
        });
    });
});

// Get all users (admin only) - for contributors list
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                picture: true,
                isPro: true,
                isAdmin: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Update user Pro status (admin only)
router.patch('/users/:id/pro', async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user.isAdmin) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { id } = req.params;
        const { isPro } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { isPro }
        });

        res.json({ success: true, user });
    } catch (error) {
        console.error('Update user Pro status error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Update user Admin status (admin only)
router.patch('/users/:id/admin', async (req, res) => {
    try {
        if (!req.isAuthenticated() || !req.user.isAdmin) {
            return res.status(403).json({ error: 'Admin access required' });
        }

        const { id } = req.params;
        const { isAdmin } = req.body;

        const user = await prisma.user.update({
            where: { id },
            data: { isAdmin }
        });

        res.json({ success: true, user });
    } catch (error) {
        console.error('Update user Admin status error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

export default router;
