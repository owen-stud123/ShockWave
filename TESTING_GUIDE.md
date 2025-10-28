# 🧪 ShockWave Testing Guide

## Quick Start for Testers

### Prerequisites
- Node.js installed
- Both frontend and backend running

---

## 🚀 Setup Instructions

### 1. Initialize the Database with Test Accounts

Navigate to the server directory and run:

```bash
cd server
npm run db:init
```

This will:
- ✅ Clear any existing user data
- ✅ Create fresh database tables
- ✅ Generate 3 test accounts (Designer, Business, Admin)

### 2. Start the Backend Server

```bash
npm run dev
```

Server will run on: `http://localhost:5000`

### 3. Start the Frontend (in a new terminal)

```bash
cd ..
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🔑 Test Account Credentials

### 👨‍🎨 Designer Account
- **Username:** `designer_creative`
- **Password:** `design2024`
- **Role:** Designer (can create gigs, submit proposals)

### 💼 Business Account
- **Username:** `business_startup`
- **Password:** `startup2024`
- **Role:** Business (can post projects, hire designers)

### 🔐 Admin Account
- **Username:** `admin_master`
- **Password:** `admin2024`
- **Role:** Administrator (full access to platform)

---

## 💡 How to Login

### Method 1: Quick Login (Recommended)
1. Go to the login page
2. Click on any of the test account cards below the login form
3. Credentials will auto-fill
4. Click "Sign In"

### Method 2: Manual Entry
1. Type username and password manually
2. Click "Sign In"

---

## 🧪 What to Test

### As a Designer:
- [ ] Login with designer account
- [ ] View dashboard
- [ ] Browse available projects
- [ ] Submit proposals to projects
- [ ] Create gigs (service offerings)
- [ ] Check messages
- [ ] Update profile

### As a Business:
- [ ] Login with business account
- [ ] Post a new project
- [ ] Browse designer profiles
- [ ] Review proposals
- [ ] Hire designers
- [ ] Send messages
- [ ] Update company profile

### As an Admin:
- [ ] Login with admin account
- [ ] View analytics dashboard
- [ ] Manage users
- [ ] Monitor platform activity
- [ ] Review flagged content

---

## 🔄 Reset Database

If you need to start fresh at any time:

```bash
cd server
npm run db:init
```

This will clear all data and recreate the 3 test accounts.

---

## ❓ Troubleshooting

### "Invalid credentials" error
- Make sure you ran `npm run db:init` first
- Check that the backend server is running
- Verify you're using the correct credentials

### Database errors
- Delete `server/database.sqlite` file
- Run `npm run db:init` again

### Token errors
- Clear browser localStorage
- Logout and login again
- Try a different browser or incognito mode

---

## 📝 Notes for Testers

- **No email verification required** - All accounts are pre-verified
- **Credentials are visible** - For easy testing, all test credentials are displayed on the login page
- **Quick account switching** - Just logout and login with a different account
- **Data persistence** - Your test data persists until you run `db:init` again

---

## 🐛 Found a Bug?

Please report with:
1. Which test account you were using
2. What action you were trying to perform
3. Any error messages
4. Screenshots if possible

---

**Happy Testing! 🎉**
