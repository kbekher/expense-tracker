# Google OAuth Setup Guide

Follow these steps to enable Google Sign-In for your expense tracker.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name: "Expense Tracker" (or whatever you prefer)
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, make sure your project is selected
2. Go to "APIs & Services" → "Library"
3. Search for "Google+ API"
4. Click on it and click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in app name: "Expense Tracker"
   - Add your email as support email
   - Click "Save and Continue"
   - Skip the Scopes section
   - Add test users (your email) if needed
   - Click "Save and Continue"

4. Back to creating OAuth client ID:
   - Application type: "Web application"
   - Name: "Expense Tracker Web"
   - Authorized JavaScript origins:
     - Add: `http://localhost:5173` (for development)
     - Add: `http://localhost:3000` (if you use different port)
     - Add your production URL when deploying
   - Authorized redirect URIs: (leave empty for now)
   - Click "Create"

5. **Copy your Client ID** - it will look like:
   ```
   123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

## Step 4: Add Client ID to Your Project

1. In your project root, create a `.env` file:
   ```bash
   cd /Users/k.bekher/Projects/expense-tracker
   touch .env
   ```

2. Add your Google Client ID to `.env`:
   ```
   VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE.apps.googleusercontent.com
   ```

3. Replace `YOUR_CLIENT_ID_HERE` with the actual Client ID you copied

## Step 5: Test Google Sign-In

1. Restart your development server if it's running
2. Open http://localhost:5173
3. Click the "Sign in with Google" button
4. You should see Google's OAuth popup

## Important Notes

- **Don't commit** your `.env` file to Git (it's already in `.gitignore`)
- For production, add your production domain to "Authorized JavaScript origins"
- The OAuth consent screen can stay in "Testing" mode for personal use
- You can add up to 100 test users in Testing mode

## Troubleshooting

**Error: "origin_mismatch"**
- Make sure `http://localhost:5173` is in "Authorized JavaScript origins"
- No trailing slash in the URL
- Match the exact port you're using

**Error: "popup_closed_by_user"**
- User closed the popup - this is normal, just try again

**Error: "access_denied"**
- In Testing mode, make sure your email is added as a test user
- Check OAuth consent screen configuration

**Google button not showing**
- Check browser console for errors
- Verify `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Restart the dev server after adding `.env`

## For Production Deployment

1. Add your production domain to "Authorized JavaScript origins":
   ```
   https://your-domain.com
   ```

2. Update OAuth consent screen to "Published" status (requires verification for public use)

3. Set the Google Client ID in your production environment variables

