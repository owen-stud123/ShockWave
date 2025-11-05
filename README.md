# 🌊 ShockWave - Digital Marketplace Platform

A comprehensive two-sided marketplace platform connecting talented graphic designers with businesses seeking creative services. Built with modern web technologies and featuring a sleek Charcoal, Light Gray, and Mint Green color scheme.

## Features

### For Designers
- **Professional Profiles**: Showcase your skills, portfolio, and experience
- **Project Discovery**: Browse and bid on exciting design projects
- **Secure Payments**: Get paid safely through integrated payment processing
- **Portfolio Management**: Display your best work to attract clients
- **Direct Messaging**: Communicate seamlessly with potential clients

### For Businesses
- **Easy Project Posting**: Post your design needs quickly and efficiently
- **Designer Discovery**: Browse and filter through talented designers
- **Proposal Management**: Review and compare designer proposals
- **Project Tracking**: Monitor project progress from start to finish
- **Review System**: Rate and review designers for future references

## Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing

### Backend
- **Node.js & Express** - Server framework
- **SQLite** - Database (with PostgreSQL migration path)
- **JWT** - Authentication
- **Stripe** - Payment processing

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   npm run server:install
   ```

2. **Set up environment**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

3. **Initialize database**
   ```bash
   cd server && node scripts/init.js
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

Visit http://localhost:5173 for the frontend and http://localhost:5000 for the API.

## Default Accounts

- **Admin**: admin@designmarket.com / admin123
- **Designer**: designer@example.com / designer123  
- **Business**: business@example.com / business123

**Change these passwords in production!**

## Documentation

We've created comprehensive documentation to help you understand and navigate the platform:

- **[USER_FLOW.md](./USER_FLOW.md)** - Detailed user journey documentation
  - First-time visitor flow
  - Designer complete workflow
  - Business hiring process
  - Admin panel operations
  - Common user actions and examples

- **[PLATFORM_FLOW_DIAGRAM.md](./PLATFORM_FLOW_DIAGRAM.md)** - Visual flow diagrams
  - System architecture
  - Authentication flows
  - Page navigation maps
  - Payment & escrow system
  - Search & filter flows
  - Mobile navigation

- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Developer quick reference
  - All routes and components
  - User roles and permissions
  - Color palette guide
  - Common UI patterns
  - API endpoints
  - Testing checklist

## Design System

### Color Palette
- **Charcoal** (#2D3436) - Primary text, dark backgrounds
- **Light Gray** (#DFE6E9) - Backgrounds, secondary elements
- **Mint Green** (#00CEC9) - Primary accent, CTAs, links

### Key Features
- Full-screen responsive layouts
- Smooth animations with Framer Motion
- Accessible design (WCAG compliant)
- Mobile-first approach
- Modern card-based UI

## Platform Routes

### Public Routes
- `/` - Landing page
- `/login` - User authentication
- `/register` - New user registration
- `/browse` - Browse designers (public)
- `/designer/:id` - View designer profile

### Protected Routes (Login Required)
- `/dashboard` - Role-based user dashboard
- `/messages` - Direct messaging system
- `/checkout/:orderId` - Payment processing
- `/admin` - Admin panel (admin only)

## User Roles

### Visitor (Unauthenticated)
- Browse public designer listings
- View designer profiles
- View project listings
- Must register to interact

### Designer
- Create & manage profile
- Upload portfolio
- Browse & apply to projects
- Submit proposals
- Receive payments
- Communicate with clients

### Business
- Post projects
- Browse & filter designers
- Review proposals
- Hire designers
- Make payments
- Leave reviews

### Admin
- User management
- Content moderation
- Transaction monitoring
- Dispute resolution
- Platform analytics

## Quick User Journey Examples

### Designer Gets First Client
```
Register → Setup Profile → Browse Projects → Submit Proposal 
→ Get Hired → Complete Work → Get Paid → Receive Review
```

### Business Finds Designer
```
Register → Browse Designers → Apply Filters → View Profile 
→ Contact Designer → Discuss Terms → Hire → Pay → Review
```

## License

MIT License - feel free to use this project for learning and development.
