# Google Calendar & Google Meet Setup Guide

To generate **real** Google Meet links automatically, you need to configure Google Calendar API with OAuth credentials.

## Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google Calendar API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click "Enable"

4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:4000/api/v1/auth/google/callback` (for development)
     - Your production callback URL (for production)
   - Copy the **Client ID** and **Client Secret**

## Step 2: Get Access Token

You have two options:

### Option A: Use Your Personal Google Account (Quick Setup)

1. Go to [Google OAuth Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your **Client ID** and **Client Secret**
5. In the left panel, find "Calendar API v3"
6. Select these scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/calendar.events`
7. Click "Authorize APIs"
8. Sign in with your Google account
9. Click "Exchange authorization code for tokens"
10. Copy the **Access token** and **Refresh token**

### Option B: Implement User OAuth Flow (Recommended for Production)

This allows each user to connect their own Google account. You'll need to:
1. Store user's Google OAuth tokens in database
2. Implement OAuth callback endpoint
3. Use user's tokens when creating meetings

## Step 3: Add to .env File

Add these to your `apps/api/.env` file:

```env
# Google Calendar API Credentials
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:4000/api/v1/auth/google/callback

# Google OAuth Tokens (for quick setup - Option A)
GOOGLE_ACCESS_TOKEN=your_access_token_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

## Step 4: Test

1. Restart your API server
2. Create a video meeting without providing a link
3. The system will automatically generate a **real** Google Meet link
4. The meeting will be synced to your Google Calendar

## Notes

- **Access tokens expire** (usually after 1 hour). You'll need to refresh them using the refresh token.
- For production, implement proper token refresh logic or use user OAuth flow.
- The Google Meet link will be a **real, working link** that can be used to join meetings.

## Troubleshooting

- **"Google Calendar not configured"**: Make sure all required env variables are set
- **"No access token available"**: Add `GOOGLE_ACCESS_TOKEN` to .env or implement user OAuth
- **"Failed to create Google Calendar event"**: Check that your access token is valid and not expired

