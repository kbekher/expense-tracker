# 💰 Expense Tracker PWA

A modern Progressive Web App for tracking daily expenses with support for recurring payments, custom categories, and detailed monthly/yearly overviews.

## Features

- ✅ **Secure Authentication**: Email/password login and Google OAuth sign-in
- ✅ **Quick Expense Entry**: Add expenses with amount and category in seconds
- ✅ **Custom Categories**: Create and manage your own expense categories with custom colors
- ✅ **Recurring Payments**: Set up monthly recurring payments (rent, subscriptions, etc.) with the ability to exclude them from specific months
- ✅ **Monthly & Yearly Overview**: View detailed statistics and breakdowns by category
- ✅ **PWA Support**: Install as an app on your device for offline access
- ✅ **Multi-User Support**: Secure backend with JWT authentication

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Authentication**: JWT + Google OAuth 2.0
- **Backend**: Vercel Serverless Functions
- **Database**: MongoDB Atlas
- **PWA**: Vite PWA Plugin
- **Hosting**: Vercel (Full-Stack)

## 🚀 Quick Deploy to Vercel

### Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Google OAuth Client ID (optional, for Google sign-in)

### Step 1: Setup MongoDB Atlas

1. **Create free account**: https://www.mongodb.com/cloud/atlas
2. **Create a cluster** (free M0 tier)
3. **Create database user**:
   - Username: `expense-user`
   - Password: (generate a strong one)
4. **Whitelist all IPs**: Add `0.0.0.0/0` to IP Access List
5. **Get connection string**: 
   - Click "Connect" → "Connect your application"
   - Copy string: `mongodb+srv://expense-user:PASSWORD@cluster.mongodb.net/expense-tracker`

### Step 2: Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy**:
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click **"Add New Project"**
   - Import your `expense-tracker` repository
   - Click **"Deploy"**

3. **Add Environment Variables** in Vercel:
   
   Go to **Settings** → **Environment Variables** and add:
   
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/expense-tracker` |
   | `JWT_SECRET` | Any random long string (e.g., `abc123xyz789...`) |
   | `VITE_GOOGLE_CLIENT_ID` | Your Google Client ID (optional) |
   
4. **Redeploy** after adding environment variables

### Step 3: Configure Google OAuth (Optional)

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 Client ID (or edit existing)
3. Add **Authorized JavaScript origins**:
   ```
   https://your-app.vercel.app
   http://localhost:5173
   ```
4. Copy Client ID to Vercel environment variables
5. Wait 5 minutes for changes to propagate

---

## 🖥️ Local Development

```bash
npm install
npm run dev
```

Open http://localhost:5173

**Note:** Backend API runs as Vercel serverless functions in production, but for local dev you can test directly with the deployed Vercel backend.

## 📱 Usage

1. **Sign up** with email/password or Google
2. **Create categories** (Food, Rent, etc.)
3. **Add expenses** daily
4. **Set up recurring payments** (rent, subscriptions)
5. **View overview** - monthly and yearly statistics

### Creating Categories

1. Navigate to the "🏷️ Categories" tab
2. Click "Add Category"
3. Enter a name and choose a color
4. Click "Create"

### Adding Expenses

1. Navigate to the "➕ Add Expense" tab
2. Enter the amount
3. Select a category
4. (Optional) Add a description
5. Click "Add Expense"

### Setting Up Recurring Payments

1. Navigate to the "🔄 Recurring" tab
2. Click "Add Recurring Payment"
3. Fill in:
   - Payment name (e.g., "Rent", "Netflix")
   - Amount
   - Category
   - Day of month (when it's due)
4. Click "Create"

To exclude a recurring payment from the current month, click the "Exclude" button next to it.

### Viewing Overview

1. Navigate to the "📊 Overview" tab
2. Switch between "Month" and "Year" view
3. Select the desired month/year from the dropdowns
4. View:
   - Total expenses
   - Recurring payments total
   - Combined total
   - Category breakdown with visual bars
   - Recent expenses list

## 🏗️ Architecture

**Vercel Serverless Functions** (`/api` directory):
- `/api/auth.js` - Authentication (login, signup, Google OAuth)
- `/api/categories.js` - Category management (coming soon)
- `/api/expenses.js` - Expense tracking (coming soon)
- `/api/recurring-payments.js` - Recurring payments (coming soon)

**Frontend** (React + TypeScript):
- PWA with offline support
- Modern UI with responsive design
- Google OAuth integration

## PWA Installation

The app is a Progressive Web App and can be installed on your device:

1. Open the app in your browser
2. Look for the install prompt in your browser's address bar
3. Or use the browser menu to "Add to Home Screen" / "Install App"

Once installed, the app will work offline and can be launched like a native app.

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user

### Categories (Coming Soon)
- Create, update, delete expense categories

### Expenses (Coming Soon)
- Track daily expenses
- View statistics by month/year

### Recurring Payments (Coming Soon)
- Set up monthly recurring expenses
- Exclude from specific months

## 🗄️ Database (MongoDB Atlas)

Free tier includes:
- 512 MB storage
- Shared RAM
- No credit card required
- Perfect for personal projects

Models: User, Category, Expense, RecurringPayment

## 🐛 Troubleshooting

**Build fails on Vercel:**
- Check environment variables are set
- View deployment logs in Vercel dashboard

**MongoDB connection error:**
- Verify `MONGODB_URI` is correct
- Check IP whitelist: add `0.0.0.0/0`

**Google OAuth not working:**
- Add Vercel URL to authorized origins
- Wait 5 minutes after making changes
- Check Google Client ID is correct

**API 404 errors:**
- Wait 30 seconds after deployment
- Clear browser cache
- Check Vercel function logs

## License

MIT
