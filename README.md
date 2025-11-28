# ShockWave

A modern, full-stack digital marketplace platform connecting creative professionals with businesses. Built with React, Node.js, Express, MongoDB, and Socket.IO.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://shockwave-platform.vercel.app/)
[![Platform Status](https://img.shields.io/badge/status-active-success)](https://shockwave-platform.vercel.app/)
[![Deployed on](https://img.shields.io/badge/deployed%20on-Vercel-black)](https://vercel.com)

## Live Demo

**Experience ShockWave Live:** [https://shockwave-platform.vercel.app/](https://shockwave-platform.vercel.app/)

### Quick Start (Deployed App)

1. **Visit the platform:** [shockwave-platform.vercel.app](https://shockwave-platform.vercel.app/)
2. **Register as Designer or Business**
3. **Explore features:**
   - Browse designers at `/browse`
   - View project listings at `/listings`
   - Access dashboard after login
   - Try real-time messaging

### Demo Credentials

For testing purposes, you can create a new account or use existing features:
- **Register:** Click "Sign Up" and choose your role (Designer/Business)
- **Email verification:** May be delayed due to email service restrictions (login still works)
- **Admin Panel:** Contact admin for access

---


## Features

### Main Platform

#### **For Designers/Freelancers**
- **Profile Management** - Showcase skills, portfolio, and work experience
- **Project Browsing** - Find and filter available projects by category and budget
- **Proposal System** - Submit proposals with custom pricing and timelines
- **Real-time Messaging** - Communicate with clients via Socket.IO
- **Portfolio Showcase** - Upload and display previous work samples
- **Earnings Dashboard** - Track income, active projects, and reviews
- **Review & Rating System** - Build reputation through client feedback

#### **For Businesses/Clients**
-  **Designer Discovery** - Browse and filter designers by skills, location, and rates
-  **Project Posting** - Create detailed project listings with requirements
-  **Proposal Management** - Review, compare, and accept designer proposals
-  **Order Tracking** - Monitor project progress with real-time updates
-  **Invoice System** - Generate and manage project invoices
-  **Secure Payments** - Protected payment processing (escrow system ready)
-  **Review System** - Rate and review completed projects

#### **Core Features**
- **Advanced Authentication** - JWT-based auth with access & refresh tokens
- **Email Verification** - Secure account verification (with fallback for server restrictions)
- **Password Reset** - Token-based password recovery system
- **Real-time Notifications** - Instant updates via WebSocket
- **File Upload System** - Cloudinary integration for images and documents
- **Responsive Design** - Mobile-first UI with Tailwind CSS
- **Search & Filters** - Advanced filtering for projects and designers
- **Progress Updates** - Track project milestones and deliverables

###  Admin Dashboard

- **User Management** - View and manage all platform users
- **Project Oversight** - Monitor all active and completed projects
- **Analytics Dashboard** - Real-time statistics and metrics
  - Total users (designers & businesses)
  - Active projects count
  - Revenue tracking
  - Platform growth metrics
- **Message Moderation** - Admin view of platform communications
- **Review Monitoring** - Oversee all user reviews and ratings
- **System Health** - Monitor platform performance and issues
---

---

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm**
- **MongoDB** (local or Atlas)
- **Git**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/owen-stud123/ShockWave.git
cd ShockWave
```

2. **Install dependencies for all packages**

```bash
npm run install:all
```

Or install manually:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd BackEnd
npm install

# Install frontend dependencies
cd ../FrontEnd
npm install
```

3. **Set up environment variables**

Create `.env` files in both `BackEnd` and `FrontEnd` directories.

**Backend `.env` (BackEnd/.env):**

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Frontend `.env` (FrontEnd/.env):**

```env
VITE_API_URL=http://localhost:5000/api
```

4. **Initialize the database**

```bash
npm run db:init
```

This will create initial collections and seed data if needed.

5. **Start the development servers**

```bash
npm run dev
```

This runs both frontend and backend concurrently.

Or start them separately:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

6. **Open your browser**

- **Frontend (Main Site):** http://localhost:5173/
- **Backend API:** http://localhost:5000/api

---


---

## Available Scripts

### Root Level Scripts

```bash
# Install all dependencies (root + backend + frontend)
npm run install:all

# Run both frontend and backend concurrently
npm run dev

# Run frontend only
npm run dev:client

# Run backend only
npm run dev:server

# Initialize database
npm run db:init

# Build frontend for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Backend Scripts

```bash
cd BackEnd

# Start development server with nodemon
npm run dev

# Start production server
npm start

# Initialize database
npm run db:init

# Run tests
npm test

# Test coverage
npm run test:coverage
```

### Frontend Scripts

```bash
cd FrontEnd

# Start Vite dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```


---

## User Roles

### Visitor (Unauthenticated)
- Browse designer profiles
- View project listings
- See public portfolios
- Access login/register pages

### Designer (Freelancer)
- Complete profile with portfolio
- Browse and filter projects
- Submit proposals with pricing
- Communicate with clients
- Track active projects
- Receive payments
- Get reviews and ratings

### Business (Client)
- Browse designers by skills/location
- Post project listings
- Review and accept proposals
- Monitor project progress
- Make secure payments
- Leave reviews

### Admin
- Access admin dashboard
- View all users and projects
- Monitor platform statistics
- Moderate content
- Manage disputes
- View system analytics

---

## Links

- **Live Demo:** [https://shockwave-platform.vercel.app/](https://shockwave-platform.vercel.app/)
- **GitHub Repository:** [ShockWave](https://github.com/owen-stud123/ShockWave)

---

## Deployment

### Frontend Deployment (Vercel)

The frontend is deployed on Vercel at: **[shockwave-platform.vercel.app](https://shockwave-platform.vercel.app/)**

**Features:**
- Automatic deployments from `main` branch
- HTTPS enabled
- Global CDN
- Optimized build with Vite
- Environment variables configured

**Environment Variables (Vercel):**
```bash
VITE_API_URL=your_backend_api_url
```

### Backend Deployment

The backend API can be deployed on:
- **Render** (recommended for Node.js apps)
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**

**Required Environment Variables:**
```bash
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=https://shockwave-platform.vercel.app
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### MongoDB Database

- **MongoDB Atlas** (Cloud database)
- Connection string configured in backend environment
- Automatic backups enabled
- Optimized for production workloads

---
---

## Author

**Owen**

- GitHub: [@owen-stud123](https://github.com/owen-stud123)
- Repository: [ShockWave](https://github.com/owen-stud123/ShockWave)
- Live Demo: [shockwave-platform.vercel.app](https://shockwave-platform.vercel.app/)

---

---

<div align="center">

 **[Try ShockWave Live](https://shockwave-platform.vercel.app/)** 

</div>
