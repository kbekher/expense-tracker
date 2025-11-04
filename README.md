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
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **PWA**: Vite PWA Plugin

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### MongoDB Setup

#### Option 1: Local MongoDB

1. Install MongoDB on your system:
   - **macOS**: `brew install mongodb-community`
   - **Windows**: Download from [MongoDB website](https://www.mongodb.com/try/download/community)
   - **Linux**: `sudo apt-get install mongodb` or `sudo yum install mongodb`

2. Start MongoDB service:
   - **macOS/Linux**: `mongod` (or `brew services start mongodb-community` on macOS)
   - **Windows**: MongoDB should start as a service automatically

3. MongoDB will run on `mongodb://localhost:27017` by default

#### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier is sufficient)
3. Create a database user
4. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/expense-tracker`)
5. Add your IP address to the whitelist (or use `0.0.0.0/0` for development)

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd expense-tracker
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd server
   npm install
   ```

4. **Set up environment variables**:
   
   **Backend** - Create `server/.env`:
   ```bash
   cd server
   touch .env
   ```
   
   Add the following to `server/.env`:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key-change-this
   ```
   
   If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker
   ```
   
   **Frontend** - Create `.env` in project root:
   ```bash
   cd /Users/k.bekher/Projects/expense-tracker
   touch .env
   ```
   
   Add your Google OAuth Client ID (optional, but recommended for Google Sign-In):
   ```env
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```
   
   See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed Google OAuth setup instructions.

### Running the Application

1. **Start the backend server** (in one terminal):
   ```bash
   cd server
   npm run dev
   ```
   
   The server will run on `http://localhost:3001`

2. **Start the frontend development server** (in another terminal):
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## Usage

### First Time Setup

1. When you first open the app, you'll see the login screen
2. You can either:
   - **Sign up with email**: Click "Sign up" and create an account with username, email, and password
   - **Sign in with Google**: Click the Google button for instant authentication
3. Your account is securely stored in MongoDB
4. You'll stay logged in (JWT token stored securely)

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

## Building for Production

### Frontend

```bash
npm run build
```

The built files will be in the `dist` directory. You can serve them with any static file server.

### Backend

The backend is already configured for production. Just make sure to set `NODE_ENV=production` in your `.env` file.

## PWA Installation

The app is a Progressive Web App and can be installed on your device:

1. Open the app in your browser
2. Look for the install prompt in your browser's address bar
3. Or use the browser menu to "Add to Home Screen" / "Install App"

Once installed, the app will work offline and can be launched like a native app.

## API Endpoints

### Users
- `POST /api/users` - Create or get user
- `GET /api/users/:id` - Get user by ID

### Categories
- `GET /api/categories/user/:userId` - Get all categories for user
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses
- `GET /api/expenses/user/:userId` - Get expenses (with optional query params: startDate, endDate, categoryId)
- `GET /api/expenses/stats/user/:userId` - Get expense statistics (with optional query params: year, month)
- `POST /api/expenses` - Create expense
- `DELETE /api/expenses/:id` - Delete expense

### Recurring Payments
- `GET /api/recurring-payments/user/:userId` - Get all recurring payments
- `POST /api/recurring-payments` - Create recurring payment
- `PUT /api/recurring-payments/:id` - Update recurring payment
- `POST /api/recurring-payments/:id/toggle-exclude` - Toggle exclude from current month
- `DELETE /api/recurring-payments/:id` - Delete recurring payment

## Database Schema

### User
- `_id`: ObjectId
- `username`: String
- `email`: String (unique)
- `createdAt`: Date

### Category
- `_id`: ObjectId
- `userId`: ObjectId (ref: User)
- `name`: String
- `color`: String (hex color)
- `createdAt`: Date

### Expense
- `_id`: ObjectId
- `userId`: ObjectId (ref: User)
- `amount`: Number
- `categoryId`: ObjectId (ref: Category)
- `date`: Date
- `description`: String (optional)
- `createdAt`: Date

### RecurringPayment
- `_id`: ObjectId
- `userId`: ObjectId (ref: User)
- `name`: String
- `amount`: Number
- `categoryId`: ObjectId (ref: Category)
- `dayOfMonth`: Number (1-31)
- `excludedMonths`: Array of Strings (format: "YYYY-MM")
- `isActive`: Boolean
- `createdAt`: Date

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongod` or check services
- Verify the connection string in `server/.env`
- For MongoDB Atlas, check your IP whitelist
- Check MongoDB logs for errors

### Backend Server Not Starting

- Check if port 3001 is already in use
- Verify all dependencies are installed: `cd server && npm install`
- Check the `.env` file exists and has correct values

### Frontend Not Connecting to Backend

- Ensure the backend server is running on port 3001
- Check the Vite proxy configuration in `vite.config.ts`
- Verify the API base URL in `src/services/api.ts`

## License

MIT
