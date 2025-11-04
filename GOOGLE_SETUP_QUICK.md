# Quick Google OAuth Setup for localhost

## Step 1: Google Cloud Console

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Find your OAuth 2.0 Client ID** (the one you created)
3. **Click the pencil icon** (Edit) next to it

## Step 2: Add localhost Origin

Under **Authorized JavaScript origins**, click **+ ADD URI**

Add these TWO URLs:
```
http://localhost:5173
http://localhost:3000
```

Click **SAVE**

## Step 3: Wait 5 Minutes

Google needs 5 minutes to propagate the changes. Grab a coffee! ☕

## Step 4: Test

1. Refresh your browser at http://localhost:5173
2. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
3. Click the "Sign in with Google" button
4. Should work now! ✅

---

## For Production (Netlify)

Add to Authorized JavaScript origins:
```
https://extraordinary-swan-b574d5.netlify.app
```

Then wait 5 minutes and test on Netlify!

---

## Troubleshooting

**Still getting errors?**
- Wait the full 5 minutes
- Hard refresh your browser
- Clear browser cache
- Make sure you edited the CORRECT client ID
- Check the client ID in your `.env` matches the one in Google Console

