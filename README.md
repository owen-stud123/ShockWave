# ShockWave - Digital Marketplace Platform

> A comprehensive two-sided marketplace platform connecting talented graphic designers with businesses seeking creative services.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)

**Live Demo** | [Documentation](#-documentation) | [Contributing](#-contributing) | [Support](#-support)

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
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | Modern UI library with latest features |
| **Vite** | 7.1.7 | Lightning-fast build tool and dev server |
| **Tailwind CSS** | 3.4.14 | Utility-first CSS framework |
| **Framer Motion** | 11.15.0 | Smooth animations and transitions |
| **React Router** | 6.28.0 | Client-side routing and navigation |
| **Axios** | 1.7.9 | HTTP client for API requests |
| **Socket.io Client** | 4.7.5 | Real-time bidirectional communication |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express** | 4.21.1 | Fast, minimalist web framework |
| **SQLite** | via better-sqlite3 | Lightweight database (PostgreSQL-ready) |
| **JWT** | 9.0.2 | Secure authentication tokens |
| **Bcrypt** | 5.1.1 | Password hashing and encryption |
| **Stripe** | 17.3.1 | Payment processing integration |
| **Socket.io** | 4.7.5 | Real-time server communication |
| **Multer** | 1.4.5 | File upload handling |
| **Sharp** | 0.33.5 | Image processing and optimization |

### DevOps & Tools
- **ESLint** - Code linting and quality
- **Vitest** - Fast unit testing framework
- **Concurrently** - Run multiple commands simultaneously
- **Nodemon** - Auto-restart development server
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/owen-stud123/ShockWave.git
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
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=./database.sqlite

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Stripe Payment (Get your keys from https://stripe.com)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### 4. Initialize Database

```bash
# From BackEnd directory
node scripts/init.js

# Or use npm script
npm run db:init
```

This creates the database schema and seeds test accounts.

#### 5. Start Development Servers

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

#### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs (if available)

---

## Configuration

### Environment Variables

The backend requires several environment variables. Create a `.env` file in the `BackEnd` directory:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment | No | development |
| `DATABASE_URL` | SQLite database path | No | ./database.sqlite |
| `JWT_SECRET` | Secret for JWT signing | **Yes** | - |
| `JWT_EXPIRES_IN` | Token expiration | No | 7d |
| `STRIPE_SECRET_KEY` | Stripe secret key | For payments | - |
| `STRIPE_PUBLISHABLE_KEY` | Stripe public key | For payments | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max upload size (bytes) | No | 5242880 (5MB) |
| `UPLOAD_PATH` | File upload directory | No | ./uploads |

### Database Configuration

The project uses **SQLite** for development, with a clear migration path to **PostgreSQL** for production.

**SQLite** (Development):
- Zero configuration required
- File-based database
- Perfect for local development
- Located at `BackEnd/database.sqlite`

**PostgreSQL** (Production - Optional):
- Update `DATABASE_URL` in `.env`
- Run migration scripts
- Better performance for production

---

## Testing

### Test Accounts

After running `npm run db:init`, the following test accounts are available:

| Role | Username | Password | Email |
|------|----------|----------|-------|
| **Designer** | `designer_creative` | `design2024` | designer@example.com |
| **Business** | `business_startup` | `startup2024` | business@example.com |
| **Admin** | `admin_master` | `admin2024` | admin@designmarket.com |

> **Security Warning**: Change these credentials in production!

### Quick Login Feature

The login page includes quick-access buttons for test accounts during development. These auto-fill credentials for faster testing.

### Running Tests

```bash
# Frontend tests
npm run test

# Backend tests
cd BackEnd
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Manual Testing Checklist

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing instructions:

- User registration and login
- Designer profile creation
- Business project posting
- Proposal submission
- Messaging system
- Payment flow
- Review system
- Admin panel functions

---

---

## Documentation

Comprehensive documentation is available to help you understand and navigate the platform:

### Core Documentation

| Document | Description | Best For |
|----------|-------------|----------|
| **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** | Central hub for all documentation | Finding what you need |
| **[USER_FLOW.md](./USER_FLOW.md)** | Detailed user journey documentation | UX design, testing |
| **[PLATFORM_FLOW_DIAGRAM.md](./PLATFORM_FLOW_DIAGRAM.md)** | Visual flow diagrams & architecture | System understanding |
| **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** | Developer quick reference guide | Day-to-day development |
| **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** | Testing procedures and credentials | QA and testing |
| **[TEST_CREDENTIALS.md](./TEST_CREDENTIALS.md)** | All test account information | Quick credential lookup |
| **[ERROR_CHECK_REPORT.md](./ERROR_CHECK_REPORT.md)** | Known issues and solutions | Troubleshooting |

### Documentation Highlights

**For First-Time Users:**
1. Start with this README
2. Review [USER_FLOW.md](./USER_FLOW.md) for user journeys
3. Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for test accounts

**For Developers:**
1. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Routes, API endpoints, patterns
2. [PLATFORM_FLOW_DIAGRAM.md](./PLATFORM_FLOW_DIAGRAM.md) - Architecture diagrams
3. [ERROR_CHECK_REPORT.md](./ERROR_CHECK_REPORT.md) - Common issues

**For Designers/UX:**
1. [USER_FLOW.md](./USER_FLOW.md) - Complete user journeys
2. [PLATFORM_FLOW_DIAGRAM.md](./PLATFORM_FLOW_DIAGRAM.md) - Visual flows
3. [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Color palette & UI patterns

---

## Platform Routes

### Public Routes (No Authentication Required)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with platform overview |
| `/login` | Login | User authentication page |
| `/register` | Register | New user registration |
| `/browse` | Browse | Browse designers (public listings) |
| `/listings` | Listings | View all project listings |
| `/listing/:id` | ListingDetail | Individual project details |
| `/designer/:id` | Profile | Public designer profile view |

### Protected Routes (Authentication Required)

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/dashboard` | Dashboard | All authenticated | Role-based dashboard |
| `/profile` | Profile | All authenticated | User profile management |
| `/profile/edit` | ProfileEdit | All authenticated | Edit profile information |
| `/messages` | Messages | All authenticated | Direct messaging system |
| `/create-listing` | CreateListing | Designer only | Create new service listing |
| `/checkout/:orderId` | Checkout | Business only | Payment processing |
| `/admin` | AdminPanel | Admin only | Platform administration |

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

## Deployment

### Production Build

```bash
# Build frontend for production
npm run build

# Preview production build locally
npm run preview
```

### Environment Setup

1. **Update Environment Variables**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production database
   - Add production Stripe keys
   - Set up production email server

2. **Database Migration**
   - Migrate from SQLite to PostgreSQL (recommended)
   - Run production database scripts
   - Set up database backups

3. **Security Checklist**
   - Change all default passwords
   - Enable HTTPS/SSL
   - Configure CORS properly
   - Set up rate limiting
   - Enable Helmet security headers
   - Configure CSP (Content Security Policy)
   - Set up monitoring and logging

### Deployment Platforms

**Recommended Platforms:**

**Frontend:**
- **Vercel** - Optimized for React/Vite (Recommended)
- **Netlify** - Easy deployment with CI/CD
- **AWS Amplify** - Full-featured hosting
- **Cloudflare Pages** - Fast global CDN

**Backend:**
- **Heroku** - Simple deployment
- **Railway** - Modern platform
- **DigitalOcean App Platform** - Scalable hosting
- **AWS EC2/Elastic Beanstalk** - Full control
- **Google Cloud Run** - Containerized deployment

**Database:**
- **PostgreSQL on Heroku**
- **AWS RDS**
- **DigitalOcean Managed Databases**
- **Supabase** - PostgreSQL with additional features

### Deployment Scripts

```bash
# Build both frontend and backend
npm run build

# Start production server
npm run start

# Backend production start
cd BackEnd && npm run start
```

---

## Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/ShockWave.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Commit Your Changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference related issues
   - Wait for review

### Contribution Guidelines

- **Code Style**: Follow ESLint configuration
- **Commits**: Use clear, descriptive commit messages
- **Testing**: Add tests for new features
- **Documentation**: Update relevant docs
- **PR Size**: Keep pull requests focused and manageable

### Areas for Contribution

- Bug fixes
- New features
- Documentation improvements
- UI/UX enhancements
- Test coverage
- Accessibility improvements
- Internationalization (i18n)
- Security enhancements

---

## Troubleshooting

### Common Issues

#### Database Connection Error

**Problem**: `Error: Cannot connect to database`

**Solution**:
```bash
cd BackEnd
npm run db:init
```

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

#### File Upload Errors

**Problem**: `File too large` or `Upload failed`

**Solution**:
1. Check `MAX_FILE_SIZE` in `.env`
2. Ensure `uploads/` directory exists
3. Verify file permissions

#### CORS Errors

**Problem**: `Access-Control-Allow-Origin` error

**Solution**:
1. Verify `FRONTEND_URL` in `BackEnd/.env`
2. Check CORS configuration in `BackEnd/app.js`
3. Ensure both servers are running

#### Build Errors

**Problem**: Vite build fails

**Solution**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Getting Help

If you encounter issues not covered here:

1. Check [ERROR_CHECK_REPORT.md](./ERROR_CHECK_REPORT.md)
2. Search existing [GitHub Issues](https://github.com/owen-stud123/ShockWave/issues)
3. Create a new issue with:
   - Detailed problem description
   - Steps to reproduce
   - Error messages
   - Environment information (OS, Node version, etc.)

---

## Project Status

### Current Version
**v1.0.0** - Stable Release

### Feature Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Complete | JWT-based auth |
| Designer Profiles | ✅ Complete | Portfolio support |
| Business Profiles | ✅ Complete | Company info |
| Project Listings | ✅ Complete | CRUD operations |
| Proposal System | ✅ Complete | Bid management |
| Messaging | ✅ Complete | Real-time chat |
| Payment Integration | 🚧 In Progress | Stripe integration |
| Review System | ✅ Complete | 5-star ratings |
| Admin Panel | ✅ Complete | User management |
| File Uploads | ✅ Complete | Image optimization |
| Email Notifications | 📋 Planned | Coming soon |
| Mobile App | 📋 Planned | Future release |

### Roadmap

**Q1 2025:**
- [ ] Complete Stripe payment integration
- [ ] Email notification system
- [ ] Advanced search filters
- [ ] Designer verification badges

**Q2 2025:**
- [ ] Mobile responsive improvements
- [ ] Video portfolio support
- [ ] Analytics dashboard
- [ ] Multi-language support (i18n)

**Future:**
- [ ] Native mobile apps (iOS/Android)
- [ ] AI-powered designer matching
- [ ] Subscription plans
- [ ] Advanced analytics

---

## License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2025 ShockWave

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Support

### Resources

- **Documentation**: [./DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- **Issue Tracker**: [GitHub Issues](https://github.com/owen-stud123/ShockWave/issues)
- **Discussions**: [GitHub Discussions](https://github.com/owen-stud123/ShockWave/discussions)

### Quick User Journey Examples

#### Designer Gets First Client
```
Register → Setup Profile → Upload Portfolio → Browse Projects 
→ Submit Proposal → Get Hired → Complete Work → Get Paid → Receive Review
```

#### Business Finds Designer
```
Register → Create Company Profile → Browse Designers → Apply Filters 
→ View Portfolio → Contact Designer → Discuss Project → Hire → Pay → Review
```

#### Admin Monitors Platform
```
Login → View Dashboard → Monitor Transactions → Review Reports 
→ Moderate Content → Resolve Disputes → Manage Users
```

---

## Acknowledgments

### Built With

- [React](https://react.dev) - UI Framework
- [Vite](https://vitejs.dev) - Build Tool
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Framer Motion](https://www.framer.com/motion) - Animations
- [Express](https://expressjs.com) - Backend Framework
- [Stripe](https://stripe.com) - Payment Processing

---

<div align="center">
  <strong><a href="#shockwave---digital-marketplace-platform">↑ Back to Top</a></strong><br>
  <strong>🌊 ShockWave – Connect. Create. Collaborate.</strong>
</div>