# Digital Marketplace for Graphic Designers & Businesses

A comprehensive two-sided marketplace platform connecting talented graphic designers with businesses seeking creative services.

## 🚀 Features

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

## 🛠 Tech Stack

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

## 📦 Quick Start

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

## 🔑 Default Accounts

- **Admin**: admin@designmarket.com / admin123
- **Designer**: designer@example.com / designer123  
- **Business**: business@example.com / business123

**Change these passwords in production!**

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
