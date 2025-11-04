# Quick Setup Guide

## MongoDB Setup

### Local MongoDB Installation

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Run the installer
3. MongoDB will start automatically as a service

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### MongoDB Atlas (Cloud - Recommended for Multi-User)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (free tier: M0)
4. Create a database user (remember username/password)
5. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/expense-tracker`

## Environment Setup

1. **Create `.env` file in `server/` directory:**
   ```bash
   cd server
   touch .env
   ```

2. **Add to `server/.env`:**
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   NODE_ENV=development
   ```
   
   For MongoDB Atlas, use:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
   ```

## Running the App

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```

### Terminal 2 - Frontend:
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## First Time Use

1. Enter a username when prompted
2. Enter an email when prompted
3. Start creating categories
4. Add your expenses!

## Troubleshooting

**MongoDB connection fails:**
- Check if MongoDB is running: `mongod` or check services
- Verify connection string in `.env`
- For Atlas: Check IP whitelist (add `0.0.0.0/0` for development)

**Backend won't start:**
- Check if port 3001 is available
- Verify all dependencies: `cd server && npm install`
- Check `.env` file exists

**Frontend can't connect:**
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify proxy settings in `vite.config.ts`

