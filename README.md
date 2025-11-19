# ShockWave - Digital Marketplace Platform

> A comprehensive two-sided marketplace platform connecting talented graphic designers with businesses seeking creative services.

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## Features

### For Designers
- **Professional Profiles** - Showcase skills, portfolio, and experience
- **Project Discovery** - Browse and bid on exciting design projects
- **Secure Payments** - Safe payment processing through integrated gateway
- **Portfolio Management** - Display your best work to attract clients
- **Direct Messaging** - Real-time communication with potential clients
- **Review System** - Build reputation through client reviews

###  For Businesses
- **Easy Project Posting** - Quick and efficient project creation
- **Designer Discovery** - Browse and filter talented designers
- **Proposal Management** - Review and compare designer proposals
- **Project Tracking** - Monitor progress from start to finish
- **Review System** - Rate designers for future references
- **Secure Payments** - Escrow-based payment protection

### For Administrators
- **User Management** - Comprehensive user oversight
- **Content Moderation** - Platform quality control
- **Transaction Monitoring** - Financial oversight
- **Dispute Resolution** - Conflict management tools
- **Platform Analytics** - Detailed insights and metrics

---

## Tech Stack

### Frontend
## Technology 

- React 
- Vite
- Tailwind CSS
- Framer Motion
- React Router

### Backend
## Technology 

- Node.js: JavaScript runtime environment  
- Express: Fast, minimalist web framework 
- MongoDB: NoSQL database with Mongoose ODM 
- JWT: Secure authentication tokens 
- Bcrypt: Password encryption 
- Stripe : Payment processing integration 
- Socket.io: Real-time server communication

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher) - (https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Git** - (https://git-scm.com/)
- **MongoDB** (v5.0 or higher) - (https://www.mongodb.com/try/download/community)

### Installation

#### 1. Clone the Repository

```bash
git clone https://git@github.com:owen-stud123/ShockWave.git
cd ShockWave
```

#### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm run server:install

# Or install both at once
npm run install:all
```

#### 3. Environment Setup

Create a `.env` file in the `BackEnd` directory:

```bash
cd BackEnd
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/shockwave_db

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_make_it_very_long_and_random
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production_make_it_very_long_and_random

# Client URL
CLIENT_URL=http://localhost:5173

```

#### 4. Start MongoDB

```bash
# Windows - Start MongoDB service
net start MongoDB

# Or manually start mongod
mongod --dbpath="C:\Program Files\MongoDB\Server\7.0\data"

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

#### 5. Initialize Database (Optional)

```bash
# From BackEnd directory - creates test accounts
node scripts/init.js

# Or use npm script
npm run db:init
```


#### 6. Start Development Servers

```bash
# From project root - starts both frontend and backend
npm run dev
```

Or start them separately:

```bash
# Terminal 1 - Frontend (from project root)
npm run dev:client

# Terminal 2 - Backend (from project root)
npm run dev:server
```


---

## Configuration

### Environment Variables

The backend requires several environment variables. Create a `.env` file in the `BackEnd` directory:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment | No | development |
| `MONGO_URI` | MongoDB connection string | **Yes** | mongodb://localhost:27017/shockwave_db |
| `JWT_SECRET` | Secret for JWT signing | **Yes** | - |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | **Yes** | - |
| `CLIENT_URL` | Frontend URL for CORS | No | http://localhost:5173 |

| 
| `MAX_FILE_SIZE` | Max upload size (bytes) | No | 10485760 (10MB) |
| `UPLOAD_PATH` | File upload directory | No | ./uploads |
| `RATE_LIMIT_WINDOW` | Rate limit time window | No | 900000 (15min) |
| `RATE_LIMIT_MAX` | Max requests per window | No | 100 |

### Database Configuration

The project uses **MongoDB** with Mongoose ODM for flexible, document-based data storage.

**MongoDB** (Development & Production):
- Install MongoDB Community Edition
- Default connection: `mongodb://localhost:27017/shockwave_db`
- Start MongoDB service before running the app
- Mongoose handles schema validation and relationships

**MongoDB Atlas** (Cloud - Optional):
- Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Update `MONGO_URI` with your connection string
- Automatic scaling and backups
- Recommended for production deployment

---

---

## Documentation

Comprehensive documentation is available to help you understand and navigate the platform:


---



## User Roles & Capabilities

### Designer Role

**Capabilities:**
- ✅ Create and manage professional profile
- ✅ Upload and showcase portfolio
- ✅ Browse available projects
- ✅ Submit proposals to businesses
- ✅ Create service listings (gigs)
- ✅ Receive payments via platform
- ✅ Communicate with clients
- ✅ Receive and respond to reviews

**Restrictions:**
- ❌ Cannot post projects
- ❌ Cannot hire other designers
- ❌ Cannot access admin panel

### 💼 Business Role

**Capabilities:**
- ✅ Create company profile
- ✅ Post project requirements
- ✅ Browse designer portfolios
- ✅ Review designer proposals
- ✅ Hire designers
- ✅ Make secure payments
- ✅ Communicate with designers
- ✅ Leave reviews and ratings

**Restrictions:**
- ❌ Cannot create service listings
- ❌ Cannot apply to projects
- ❌ Cannot access admin panel

### Admin Role

**Capabilities:**
- ✅ All Designer and Business capabilities
- ✅ User management (create, edit, delete)
- ✅ Content moderation
- ✅ Transaction monitoring
- ✅ Dispute resolution
- ✅ Platform analytics and reporting
- ✅ System configuration

**Full Access:** All platform features and controls

---




---



## Troubleshooting

### Common Issues

#### MongoDB Connection Error

**Problem**: `Error connecting to MongoDB` or `MongooseServerSelectionError`

**Solution**:

-  Use MongoDB Atlas (cloud)
- Create free cluster at mongodb.com/cloud/atlas
- Update `MONGO_URI` in `.env` with connection string

#### Port Already in Use

**Problem**: `Error: Port 5000 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

Or change the port in `BackEnd/.env`:
```env
PORT=5001
```

#### JWT Token Errors

**Problem**: `Invalid token` or `Token expired`

**Solution**:
1. Clear browser localStorage
2. Log out and log back in
3. Check JWT_SECRET in `.env`
4. Verify JWT_EXPIRES_IN value

---

<div align="center">
  <strong><a href="#shockwave---digital-marketplace-platform">↑ Back to Top</a></strong><br>
  <strong>ShockWave – Connect. Create. Collaborate.</strong>
</div>