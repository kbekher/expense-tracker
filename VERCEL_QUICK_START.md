# 🚀 Quick Start: Deploy to Vercel

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Google OAuth Client ID (optional, for Google sign-in)

---

## Step-by-Step (5 Minutes)

### 1. **Push to GitHub**

```bash
cd /Users/k.bekher/Projects/expense-tracker
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2. **Deploy to Vercel**

1. Go to **https://vercel.com**
2. Click **"Sign Up"** with GitHub
3. Click **"Add New"** → **"Project"**
4. Find `expense-tracker` and click **"Import"**
5. Click **"Deploy"**

### 3. **Add Environment Variables**

After deployment, go to:
**Project Settings** → **Environment Variables**

Add these 3 variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/expense-tracker` |
| `JWT_SECRET` | `any-random-long-string-here-abc123xyz` |
| `VITE_GOOGLE_CLIENT_ID` | `your-google-client-id.apps.googleusercontent.com` (optional) |

Click **"Add"** for each, then click **"Redeploy"** (top right)

### 4. **Update Google OAuth** (if using)

1. Go to **https://console.cloud.google.com/apis/credentials**
2. Edit your OAuth Client ID
3. Add your Vercel URL to **Authorized JavaScript origins**:
   ```
   https://your-app-name.vercel.app
   ```
4. **Save** and wait 5 minutes

### 5. **Test Your App!**

Open: `https://your-app-name.vercel.app`

Try:
- ✅ Sign up with email/password
- ✅ Login
- ✅ Google Sign-In (if configured)

---

## ✅ What You Get

**Before (Netlify + Render):**
- ❌ 50-second cold starts
- ❌ Slow Google OAuth
- ❌ Two separate deployments

**After (Vercel):**
- ✅ ~2 second cold starts
- ✅ Google OAuth works
- ✅ One-click deployment
- ✅ Auto HTTPS
- ✅ Free tier with good limits

---

## 🔧 Known Limitations

⚠️ **I only created the auth endpoint (`/api/auth.js`)**

You'll need to create these too:
- `/api/categories.js`
- `/api/expenses.js`  
- `/api/recurring-payments.js`

**Want me to create them?** Just ask! 🚀

For now, you can **test login/signup** which should work perfectly!

---

## 🐛 Troubleshooting

**"Module not found" error?**
→ Install missing dependencies: `npm install bcryptjs jsonwebtoken`

**MongoDB connection error?**
→ Check MongoDB Atlas IP whitelist: add `0.0.0.0/0`

**Build fails?**
→ Check Vercel logs: Dashboard → Deployments → Click latest → View Logs

**Need help?** I'm here! 💪

