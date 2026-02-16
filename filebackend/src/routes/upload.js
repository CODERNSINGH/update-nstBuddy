import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';
import { uploadToCloudinary } from '../services/cloudinary.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only PDF, DOCX, PPTX files
        const allowedMimes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/msword',
            'application/vnd.ms-powerpoint'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOCX, and PPTX files are allowed.'));
        }
    }
});

/**
 * POST /api/upload
 * Upload a file to Cloudinary
 * Requires authentication
 */
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Get file name from request body
        const fileName = req.body.fileName || req.file.originalname;
        const userEmail = req.user.email;

        console.log(`📤 Uploading file: ${fileName} for user: ${userEmail}`);

        // Upload to Cloudinary
        const result = await uploadToCloudinary(
            req.file.buffer,
            fileName,
            userEmail
        );

        console.log(`✅ Upload successful: ${result.secure_url}`);

        // Return success response
        res.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            bytes: result.bytes,
            uploadedAt: result.created_at
        });

    } catch (error) {
        console.error('Upload error:', error);

        if (error.message.includes('Invalid file type')) {
            return res.status(400).json({
                success: false,
                error: error.message
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to upload file. Please try again.'
        });
    }
});

export default router;
