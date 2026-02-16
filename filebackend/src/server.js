import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/upload', uploadRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'filebackend' });
});

// Keep-alive function to prevent server from sleeping (Render free tier)
const keepAlive = () => {
    const INTERVAL = 13 * 60 * 1000; // 13 minutes in milliseconds

    setInterval(async () => {
        try {
            // Ping this server
            const selfUrl = process.env.SELF_URL || 'https://update-nstbuddy-kzzl.onrender.com';
            await fetch(`${selfUrl}/health`);
            console.log('🏓 Keep-alive: Self ping successful');

            // Ping main backend
            const mainBackendUrl = 'https://update-nstbuddy.onrender.com/api';
            await fetch(mainBackendUrl);
            console.log('🏓 Keep-alive: Main backend ping successful');
        } catch (error) {
            console.error('❌ Keep-alive ping failed:', error.message);
        }
    }, INTERVAL);

    console.log('⏰ Keep-alive scheduler started (13 min intervals)');
};

// Start server
app.listen(PORT, () => {
    console.log(`🚀 File upload backend running on port ${PORT}`);
    console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);

    // Start keep-alive only in production
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_KEEPALIVE === 'true') {
        keepAlive();
    }
});
