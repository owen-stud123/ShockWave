# 🚀 ShockWave - Quick Reference Guide

## Platform Routes & Access

### Public Routes (No Authentication Required)
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Landing page with hero, features, CTA |
| `/login` | Login | User authentication page |
| `/register` | Register | New user registration |
| `/browse` | Browse | Browse all designers (public view) |
| `/designer/:id` | Profile | View designer profile & portfolio |
| `/listing/:id` | ListingDetail | View project/listing details |

### Protected Routes (Authentication Required)
| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/dashboard` | Dashboard | All Users | Role-based dashboard |
| `/messages` | Messages | All Users | Direct messaging system |
| `/checkout/:orderId` | Checkout | All Users | Payment processing |
| `/admin` | AdminPanel | Admin Only | Platform administration |

---

## User Roles & Capabilities

### 👤 Visitor (Unauthenticated)
- ✅ View landing page
- ✅ Browse public designer listings
- ✅ View designer profiles
- ✅ View project listings
- ❌ Cannot send messages
- ❌ Cannot hire or apply
- **Next Step**: Register or Login

### 🎨 Designer (Authenticated)
- ✅ Create & manage profile
- ✅ Set hourly rate
- ✅ Upload portfolio
- ✅ Browse projects
- ✅ Submit proposals
- ✅ Receive payments
- ✅ Communicate with clients
- ✅ Receive reviews
- ❌ Cannot post projects

### 💼 Business (Authenticated)
- ✅ Browse designers
- ✅ Filter by skills/rate
- ✅ Post projects
- ✅ Review proposals
- ✅ Hire designers
- ✅ Make payments
- ✅ Communicate with designers
- ✅ Leave reviews
- ❌ Cannot submit proposals

### 🔐 Admin (Special Access)
- ✅ All user capabilities
- ✅ Access admin panel
- ✅ Manage all users
- ✅ Monitor transactions
- ✅ Handle disputes
- ✅ Content moderation

---

## Key User Journeys (Simplified)

### Journey 1: New Designer Gets First Client
```
Register → Setup Profile → Browse Projects → Submit Proposal 
→ Get Hired → Complete Work → Get Paid → Receive Review
```

### Journey 2: Business Finds Designer
```
Register → Browse Designers → Apply Filters → View Profile 
→ Send Message → Discuss Terms → Hire → Pay → Leave Review
```

### Journey 3: Business Posts Project
```
Login → Dashboard → Post Project → Wait for Proposals 
→ Review Bids → Accept Proposal → Project Starts → Pay
```

---

## Navigation Structure

### Header (Navbar)
**For Visitors:**
- ShockWave (Logo) → Home
- Browse Designers
- Find Work
- Login
- Sign Up

**For Authenticated Users:**
- ShockWave (Logo) → Home
- Browse Designers
- Find Work
- Dashboard
- Messages
- Logout

### Footer (Always Visible)
**For Designers:**
- Find Work
- Build Portfolio
- Success Stories
- Resources

**For Businesses:**
- Post a Job
- Browse Designers
- Enterprise
- Pricing

**Legal & Social:**
- Privacy Policy
- Terms of Service
- Contact
- Social Media Links

---

## Page-by-Page Breakdown

### 1. Home (`/`)
**Purpose**: Platform introduction & conversion
**Features**:
- Hero section with CTA buttons
- Features showcase (3 cards)
- Final CTA section
- Full-screen sections

**Actions**:
- Click "Get Started" → `/login`
- Click "Browse Designers" → `/browse`
- Scroll to learn about features

---

### 2. Login (`/login`)
**Purpose**: User authentication
**Features**:
- Username/password form
- Test account quick-login buttons
- Error handling
- "Register here" link

**Test Accounts**:
- Designer: `designer_creative` / `design2024`
- Business: `business_startup` / `startup2024`
- Admin: `admin_master` / `admin2024`

---

### 3. Register (`/register`)
**Purpose**: New user onboarding
**Features**:
- Full name, username fields
- Role selection (Designer/Business)
- Password & confirmation
- Auto-login on success

**Validation**:
- Password match check
- Required field validation

---

### 4. Browse (`/browse`)
**Purpose**: Discover designers
**Features**:
- Search bar
- 5 filter options:
  - Search by name
  - Skill filter
  - Location filter
  - Min/Max rate
- Designer cards grid (3 columns)
- Hover effects

**Designer Card Shows**:
- Avatar/Initial
- Name & location
- Bio preview
- Skills (3 max + count)
- Hourly rate
- Rating & completed projects
- "View Profile" button

---

### 5. Dashboard (`/dashboard`)
**Purpose**: User hub
**Features**:
- Personalized greeting
- 4 stat cards:
  - Active Projects
  - Total Earnings/Spent
  - Messages
  - Reviews
- Role-specific quick actions
- Recent activity feed

**Designer Actions**:
- Create New Gig
- Browse Projects
- Update Portfolio

**Business Actions**:
- Post New Project
- Browse Designers
- View Proposals

---

### 6. Messages (`/messages`)
**Purpose**: Communication hub
**Features**:
- Conversation list (left panel)
- Chat window (right panel)
- Send/receive messages
- File attachments
- Real-time notifications

**Current State**: Empty state UI
- "No messages yet" message
- Icon illustration
- Instructional text

---

### 7. Profile (`/designer/:id`)
**Purpose**: Designer showcase
**Features**:
- Profile header
- Bio & description
- Skills list
- Hourly rate
- Rating & reviews
- Portfolio gallery
- "Contact" button

---

### 8. Listing Detail (`/listing/:id`)
**Purpose**: Project/gig details
**Features**:
- Project title & description
- Budget range
- Timeline/deadline
- Required skills
- Client information
- "Apply" button (designers)
- "View Proposal" (businesses)

---

### 9. Checkout (`/checkout/:orderId`)
**Purpose**: Payment processing
**Features**:
- Order summary
- Payment method selection
- Billing information
- Escrow explanation
- "Complete Payment" button

**Security**:
- Secure payment gateway
- Escrow protection
- Payment confirmation

---

### 10. Admin Panel (`/admin`)
**Purpose**: Platform management
**Features**:
- User management
- Project monitoring
- Transaction oversight
- Dispute resolution
- Analytics dashboard
- Content moderation

**Access**: Admin role only

---

## Color Palette Reference

| Color | Hex Code | Usage |
|-------|----------|-------|
| **Charcoal** | `#2D3436` | Primary text, dark backgrounds |
| **Charcoal Light** | `#3d4547` | Hover states, secondary text |
| **Charcoal Dark** | `#1d2426` | Footer, emphasis |
| **Light Gray** | `#DFE6E9` | Backgrounds, dividers |
| **Light Gray Light** | `#F5F7F8` | Page backgrounds |
| **Light Gray Dark** | `#B2BEC3` | Borders, disabled states |
| **Mint** | `#00CEC9` | Primary CTA, links, accents |
| **Mint Light** | `#55EFC4` | Hover states, highlights |
| **Mint Dark** | `#00B894` | Active states, pressed |

---

## Common UI Patterns

### Button Styles
```jsx
// Primary Button (Mint)
className="bg-mint text-white px-6 py-3 rounded-lg hover:bg-mint-dark"

// Secondary Button (Charcoal)
className="bg-charcoal text-white px-6 py-3 rounded-lg hover:bg-charcoal-light"

// Outline Button
className="border-2 border-mint text-mint px-6 py-3 rounded-lg hover:bg-mint hover:text-white"
```

### Card Styles
```jsx
// Standard Card
className="bg-white p-6 rounded-lg shadow-md border-2 border-mint/20"

// Hover Card
className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:border-mint"
```

### Input Styles
```jsx
// Text Input
className="w-full px-4 py-3 border-2 border-lightgray-dark rounded-lg focus:ring-2 focus:ring-mint focus:border-transparent"
```

---

## State Management (AuthContext)

### Available Auth Functions
```javascript
const { user, isAuthenticated, login, logout, register, error } = useAuth();
```

### User Object Structure
```javascript
{
  id: number,
  name: string,
  username: string,
  role: 'designer' | 'business' | 'admin',
  // ... other fields
}
```

---

## API Endpoints (Expected)

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - New user registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Profiles
- `GET /api/profiles` - List all designer profiles
- `GET /api/profiles/:id` - Get single profile
- `PUT /api/profiles/:id` - Update profile
- `GET /api/profiles/search` - Search with filters

### Projects
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project

### Messages
- `GET /api/messages` - Get user conversations
- `POST /api/messages` - Send new message
- `GET /api/messages/:conversationId` - Get conversation history

### Orders/Checkout
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `POST /api/orders/:id/pay` - Process payment

---

## Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets, show desktop nav |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |

---

## Key Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ Active | Working |
| User Login | ✅ Active | Working |
| Browse Designers | ✅ Active | Working |
| Designer Profiles | ✅ Active | Working |
| Dashboard | ✅ Active | Role-based |
| Messages | 🚧 UI Only | Backend needed |
| Project Posting | 🚧 Planned | Coming soon |
| Proposals | 🚧 Planned | Coming soon |
| Payments | 🚧 Planned | Coming soon |
| Reviews | 🚧 Planned | Coming soon |
| Admin Panel | 🚧 Planned | Coming soon |

Legend: ✅ Active | 🚧 In Progress | 📋 Planned

---

## Development Tips

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update navbar links if needed
4. Test authentication requirements
5. Add to this documentation

### Protecting a Route
```jsx
// In App.jsx
<Route 
  path="/protected" 
  element={
    isAuthenticated ? <ProtectedPage /> : <Navigate to="/login" />
  } 
/>
```

### Using the Color Palette
```jsx
// In Tailwind classes
className="bg-mint text-charcoal hover:bg-mint-dark"

// Custom colors defined in tailwind.config.js
```

---

## Testing Checklist

### Before Deploying
- [ ] Test all authentication flows
- [ ] Verify role-based access
- [ ] Check mobile responsiveness
- [ ] Test all navigation links
- [ ] Verify form validations
- [ ] Check error handling
- [ ] Test loading states
- [ ] Verify color consistency
- [ ] Check accessibility (ARIA labels)
- [ ] Test on multiple browsers

---

## Useful Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm run lint         # Run ESLint
npm run test         # Run tests (if configured)

# Deployment
npm run deploy       # Deploy to hosting (if configured)
```

---

## Support & Resources

- **Documentation**: See USER_FLOW.md for detailed flows
- **Diagrams**: See PLATFORM_FLOW_DIAGRAM.md for visual flows
- **Code**: Check component files in `src/`
- **Styling**: Review `tailwind.config.js` for theme
- **API**: See backend documentation (when available)

---

**Last Updated**: November 3, 2025
**Version**: 1.0.0
**Status**: Active Development 🚀
