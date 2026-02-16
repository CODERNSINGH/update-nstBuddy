import { auth } from '../config/firebase';

const UPLOAD_API_URL = 'http://localhost:5001/api/upload';

/**
 * Upload a file to the backend which handles Cloudinary upload
 * @param file - File to upload
 * @param fileName - Name for the file
 * @param userEmail - User's email (for tracking)
 * @returns Upload result with URL
 */
export const uploadToCloudinary = async (
    file: File,
    fileName: string,
    userEmail: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
        // Get Firebase auth token
        const currentUser = auth.currentUser;
        if (!currentUser) {
            return {
                success: false,
                error: 'You must be logged in to upload files'
            };
        }

        const token = await currentUser.getIdToken();

        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);

        // Upload to backend
        const response = await fetch(UPLOAD_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'Upload failed');
        }

        return {
            success: true,
            url: data.url
        };
    } catch (error) {
        console.error('Upload error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Upload failed'
        };
    }
};

