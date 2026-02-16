import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} userEmail - User's email for metadata
 * @returns {Promise<Object>} Upload result
 */
export const uploadToCloudinary = async (fileBuffer, fileName, userEmail) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'nst-ai-training',
                resource_type: 'auto',
                context: {
                    filename: fileName,
                    email: userEmail,
                    uploaded_at: new Date().toISOString()
                },
                tags: ['ai-training', 'nst', 'user-contribution']
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
};

export default cloudinary;
