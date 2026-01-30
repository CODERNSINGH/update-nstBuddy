import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, uniqueKey } = req.body;

        if (!email || !uniqueKey) {
            return res.status(400).json({ error: 'Email and unique key are required' });
        }

        // Find admin by email
        const admin = await prisma.admin.findUnique({
            where: { email }
        });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare unique key
        const isValidKey = await bcrypt.compare(uniqueKey, admin.uniqueKey);

        if (!isValidKey) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create simple token (email:uniqueKey base64 encoded)
        const token = Buffer.from(`${email}:${uniqueKey}`).toString('base64');

        res.json({
            success: true,
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Verify token
router.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [email, uniqueKey] = decoded.split(':');

        const admin = await prisma.admin.findUnique({
            where: { email }
        });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const isValidKey = await bcrypt.compare(uniqueKey, admin.uniqueKey);

        if (!isValidKey) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        res.json({
            success: true,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (error) {
        console.error('Verify error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

// Create initial admin (for setup only - should be removed in production)
router.post('/setup-admin', async (req, res) => {
    try {
        const { email, uniqueKey, name } = req.body;

        if (!email || !uniqueKey || !name) {
            return res.status(400).json({ error: 'Email, unique key, and name are required' });
        }

        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        // Hash the unique key
        const hashedKey = await bcrypt.hash(uniqueKey, 10);

        const admin = await prisma.admin.create({
            data: {
                email,
                uniqueKey: hashedKey,
                name
            }
        });

        res.json({
            success: true,
            message: 'Admin created successfully',
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (error) {
        console.error('Setup admin error:', error);
        res.status(500).json({ error: 'Failed to create admin' });
    }
});

export default router;
