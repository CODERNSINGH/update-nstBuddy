# File Upload Backend - README

## 🚀 Quick Start

This is a separate backend service that handles file uploads to Cloudinary for the NST Buddy AI training feature.

### Installation

```bash
cd filebackend
npm install
```

### Configuration

1. Copy `.env` file and update the following:

```env
# Cloudinary Configuration (REQUIRED)
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=LhsOUIb-gOXoruoX8lphlaaaZXo
CLOUDINARY_API_SECRET=your_api_secret_here  # Get this from Cloudinary dashboard
```

2. Get your Cloudinary API Secret:
   - Go to [Cloudinary Dashboard](https://cloudinary.com/console)
   - Click on "Dashboard" in the left sidebar
   - Copy the **API Secret** (click the eye icon to reveal it)
   - Paste it in the `.env` file

### Running the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5001`

## 📡 API Endpoints

### POST /api/upload
Upload a file to Cloudinary

**Authentication:** Required (Firebase JWT token)

**Headers:**
```
Authorization: Bearer <firebase-token>
```

**Body:** multipart/form-data
- `file`: File to upload (PDF, DOCX, PPTX)
- `fileName`: Name for the file

**Response:**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "publicId": "nst-ai-training/...",
  "format": "pdf",
  "bytes": 123456,
  "uploadedAt": "2026-02-16T..."
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "service": "filebackend"
}
```

## 🔒 Security Features

- ✅ Firebase authentication required
- ✅ File type validation (PDF, DOCX, PPTX only)
- ✅ File size limit (50MB)
- ✅ CORS protection
- ✅ API keys stored securely on server
- ✅ User email tracking in metadata

## 📁 Project Structure

```
filebackend/
├── src/
│   ├── server.js              # Express server
│   ├── middleware/
│   │   └── auth.js            # Firebase auth middleware
│   ├── routes/
│   │   └── upload.js          # Upload route
│   └── services/
│       └── cloudinary.js      # Cloudinary service
├── .env                       # Environment variables
├── .gitignore
└── package.json
```

## 🔧 Dependencies

- **express**: Web framework
- **multer**: File upload handling
- **cloudinary**: Cloudinary SDK
- **firebase-admin**: Firebase authentication
- **cors**: CORS middleware
- **dotenv**: Environment variables

## 🧪 Testing

Test the upload endpoint:

```bash
# Health check
curl http://localhost:5001/health

# Upload file (requires auth token)
curl -X POST http://localhost:5001/api/upload \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -F "file=@/path/to/file.pdf" \
  -F "fileName=Test Document"
```

## 🚨 Important Notes

1. **API Secret**: Never commit your Cloudinary API secret to git
2. **Firebase**: Uses the same Firebase project as the main backend
3. **Port**: Runs on port 5001 (different from main backend on 10000)
4. **CORS**: Only allows requests from `http://localhost:5173` in development

## 🔄 Integration with Frontend

The frontend automatically calls this backend when uploading files. Make sure:

1. This backend is running on port 5001
2. Main backend is running (for Firebase auth)
3. Frontend is running on port 5173

## 📝 Logs

The server logs all upload attempts:
```
📤 Uploading file: example.pdf for user: user@example.com
✅ Upload successful: https://res.cloudinary.com/...
```
