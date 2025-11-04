# Deploy Full Stack App to Vercel

## ✅ What's Been Set Up

1. ✅ Created `/api/auth.js` - Serverless function for authentication
2. ✅ Created `vercel.json` - Vercel configuration
3. ✅ Updated API routes to use `/api` (serverless functions)
4. ✅ Updated build scripts

## 🚀 Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. **Go to:** https://vercel.com
2. **Sign up/Login** with GitHub
3. Click **"Add New Project"**
4. **Import** your `expense-tracker` repository
5. Click **"Import"**

### Step 3: Configure Environment Variables

In Vercel dashboard, go to **Settings** → **Environment Variables**

Add these:

**Key:** `MONGODB_URI`  

**Key:** `JWT_SECRET`  

**Key:** `VITE_GOOGLE_CLIENT_ID` (optional, for Google OAuth)  

Click **"Add"** for each.

### Step 4: Deploy

Click **"Deploy"** button!

Vercel will:
- ✅ Build your React app
- ✅ Deploy serverless functions
- ✅ Give you a URL: `https://expense-tracker-xyz.vercel.app`

### Step 5: Update Google OAuth (if using)

Go to https://console.cloud.google.com/apis/credentials

1. Edit your OAuth 2.0 Client ID
2. Add to **Authorized JavaScript origins**:
   ```
   https://expense-tracker-xyz.vercel.app
   ```
   (Replace with your actual Vercel URL)
3. **Save** and wait 5 minutes

## ✅ Done!

Your app is now live at: `https://your-app.vercel.app`

**Both frontend AND backend** are hosted on Vercel!

## 🔧 Local Development

To run locally:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## 🆚 Vercel vs Current Setup

**Before:**
- Frontend: Netlify
- Backend: Render (slow cold starts)
- 2 separate deployments

**After:**
- Frontend + Backend: Vercel
- ✅ Faster (no cold starts for frequently used functions)
- ✅ One deployment
- ✅ Automatic HTTPS
- ✅ Free tier: Generous limits

## 📝 Next Steps

After deploying, you still need to create the other API endpoints:
- `/api/expenses.js`
- `/api/categories.js`
- `/api/recurring-payments.js`

Want me to create those too?

## ⚠️ Important Notes

1. **Serverless functions** have a 10-second timeout on free tier
2. **MongoDB connections** are pooled (the code handles this)
3. **Cold starts** are ~1-2 seconds (much better than Render's 50s!)
4. **Free tier limits**: 100GB bandwidth, 100 serverless function invocations/day

## 🐛 Troubleshooting

**Build fails?**
- Check environment variables are set
- Check `vercel.json` syntax

**API 404 errors?**
- Wait 30 seconds after deployment
- Check Vercel logs: Dashboard → Deployments → Click deployment → Logs

**MongoDB connection fails?**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0`)

