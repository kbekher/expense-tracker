# 🖥️ Local Development Guide

## Quick Start (Frontend Only)

If you just want to test the UI with your deployed backend:

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Full Local Development (Frontend + API)

To run both frontend and serverless functions locally:

### Step 1: Setup Environment Variables

Create `.env.local` in the root directory:

```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Step 2: Run with Vercel CLI

```bash
vercel dev
```

This will:
- ✅ Start frontend on http://localhost:3000
- ✅ Run API functions locally at `/api/*`
- ✅ Use your `.env.local` variables
- ✅ Simulate production environment

---

## Option 3: Standard Vite Dev Server

```bash
npm run dev
```

- Runs on http://localhost:5173
- API calls go to deployed Vercel backend
- Faster hot reload
- Good for UI-only changes

---

## Which to Use?

**Use `npm run dev` if:**
- Testing UI changes only
- Don't need to modify API
- Want faster reload

**Use `vercel dev` if:**
- Testing API changes
- Need full local environment
- Debugging serverless functions

---

## Troubleshooting

**`vercel dev` asks for login:**
```bash
vercel login
```

**Port 3000 already in use:**
```bash
vercel dev --listen 3001
```

**Environment variables not loading:**
- Make sure `.env.local` exists
- Check variable names match exactly
- Restart `vercel dev`

---

## Pro Tips

1. **Hot reload**: Both methods support hot reload
2. **Database**: Always points to MongoDB Atlas (no local DB needed)
3. **Google OAuth**: Add `http://localhost:3000` to authorized origins if using `vercel dev`

