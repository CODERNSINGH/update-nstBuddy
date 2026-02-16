import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRouter from './routes/upload.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/upload', uploadRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'filebackend' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 File upload backend running on port ${PORT}`);
    console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
});
