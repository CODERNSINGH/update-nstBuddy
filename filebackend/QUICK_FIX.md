# Quick Fix for 500 Error

## Problem
The backend is returning a 500 error because Cloudinary credentials are not configured.

## Solution

You need to update the `filebackend/.env` file with your actual Cloudinary credentials.

### Step 1: Get Your Cloudinary Credentials

1. Go to: https://cloudinary.com/console
2. Log in to your account
3. On the Dashboard, you'll see:
   - **Cloud Name** (top-left corner)
   - **API Key** (already provided: `LhsOUIb-gOXoruoX8lphlaaaZXo`)
   - **API Secret** (click the eye icon 👁️ to reveal it)

### Step 2: Update filebackend/.env

Open `filebackend/.env` and replace these lines:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

With your actual values:

```env
CLOUDINARY_CLOUD_NAME=dxxxxxxxx  # Your actual cloud name
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxx  # Your actual API secret
```

### Step 3: Restart the Backend

After updating the `.env` file:

```bash
# Stop the current backend (Ctrl+C)
# Then restart it
cd filebackend
npm run dev
```

### Step 4: Test Again

1. Go to http://localhost:5173/contribute
2. Click "🧠 Help Train Our AI Model"
3. Upload a PDF file
4. It should work now!

## Example .env File

Your `filebackend/.env` should look like this (with your actual values):

```env
# Environment variables for file upload backend
PORT=5001

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dxxxxxxxx        # ← Replace with your cloud name
CLOUDINARY_API_KEY=LhsOUIb-gOXoruoX8lphlaaaZXo
CLOUDINARY_API_SECRET=xxxxxxxxxxxxx   # ← Replace with your API secret

# Firebase Admin SDK (for authentication)
FIREBASE_PROJECT_ID=nstbuddy-1fe6f
FIREBASE_PRIVATE_KEY_PATH=../backend/firebase-service-account.json

# CORS
FRONTEND_URL=http://localhost:5173
```

## Verification

After restarting, you should see in the terminal:
```
🚀 File upload backend running on port 5001
📁 Upload endpoint: http://localhost:5001/api/upload
✅ Firebase Admin initialized
```

If you see any errors about Cloudinary or Firebase, check your credentials again.
