# 🌊 ShockWave Platform - User Flow Guide

## Platform Overview
ShockWave is a digital marketplace connecting graphic designers with businesses. The platform supports two primary user types: **Designers** and **Businesses**.

---

## 📋 Table of Contents
1. [First-Time Visitor Flow](#first-time-visitor-flow)
2. [Designer User Journey](#designer-user-journey)
3. [Business User Journey](#business-user-journey)
4. [Admin User Journey](#admin-user-journey)
5. [Common User Actions](#common-user-actions)

---

## 🎯 First-Time Visitor Flow

### Landing Experience (Home Page)
```
START → Home Page (/)
   │
   ├─→ View Hero Section
   │   └─→ "Connect. Create. Collaborate."
   │
   ├─→ Explore Features Section
   │   ├─→ Easy Discovery
   │   ├─→ Secure Payments
   │   └─→ Direct Communication
   │
   ├─→ Call-to-Action Section
   │   ├─→ Click "Get Started" → Login Page
   │   └─→ Click "Browse Designers" → Browse Page
   │
   └─→ Navigation Options
       ├─→ Browse Designers
       ├─→ Find Work
       ├─→ Login
       └─→ Sign Up
```

### Registration Process
```
Click "Sign Up" → Register Page (/register)
   │
   ├─→ Fill Registration Form
   │   ├─→ Full Name
   │   ├─→ Username
   │   ├─→ Select Role (Designer/Business)
   │   ├─→ Password
   │   └─→ Confirm Password
   │
   ├─→ Submit Form
   │   ├─→ Success → Auto-login → Dashboard
   │   └─→ Error → Display error message
   │
   └─→ Already have account? → Click "Sign in" → Login Page
```

### Login Process
```
Click "Login" → Login Page (/login)
   │
   ├─→ Manual Login
   │   ├─→ Enter Username
   │   ├─→ Enter Password
   │   └─→ Click "Sign In" → Dashboard
   │
   ├─→ Quick Login (Test Accounts)
   │   ├─→ Designer Account (designer_creative/design2024)
   │   ├─→ Business Account (business_startup/startup2024)
   │   └─→ Admin Account (admin_master/admin2024)
   │
   └─→ Don't have account? → Click "Register here" → Register Page
```

---

## 🎨 Designer User Journey

### After Login - Designer Dashboard
```
Login Success → Dashboard (/dashboard)
   │
   ├─→ View Stats Overview
   │   ├─→ Active Projects: 0
   │   ├─→ Total Earnings: $0
   │   ├─→ Messages: 0
   │   └─→ Reviews: 0
   │
   ├─→ Quick Actions
   │   ├─→ Create New Gig (Coming Soon)
   │   ├─→ Browse Projects (Coming Soon)
   │   └─→ Update Portfolio (Coming Soon)
   │
   └─→ Recent Activity
       └─→ View recent project updates
```

### Designer Main Workflows

#### 1. **Setting Up Profile & Portfolio**
```
Dashboard → Update Portfolio
   │
   ├─→ Edit Profile Information
   │   ├─→ Add Bio
   │   ├─→ Add Skills
   │   ├─→ Set Hourly Rate
   │   └─→ Add Location
   │
   ├─→ Upload Portfolio Items
   │   ├─→ Add Project Images
   │   ├─→ Add Project Descriptions
   │   └─→ Showcase Best Work
   │
   └─→ Save Changes → Profile Updated
```

#### 2. **Finding Work**
```
Dashboard/Navbar → Browse Projects (/listings)
   │
   ├─→ Search & Filter Projects
   │   ├─→ Filter by Category
   │   ├─→ Filter by Budget
   │   └─→ Filter by Deadline
   │
   ├─→ View Project Details
   │   ├─→ Read Requirements
   │   ├─→ View Budget
   │   └─→ Check Client Rating
   │
   ├─→ Submit Proposal
   │   ├─→ Write Cover Letter
   │   ├─→ Set Price
   │   ├─→ Set Timeline
   │   └─→ Submit
   │
   └─→ Track Proposals → Dashboard
```

#### 3. **Managing Active Projects**
```
Dashboard → Active Projects
   │
   ├─→ View Project Details
   │   ├─→ Check Milestones
   │   ├─→ View Deadlines
   │   └─→ Review Requirements
   │
   ├─→ Communicate with Client
   │   └─→ Messages → Direct Chat
   │
   ├─→ Submit Work
   │   ├─→ Upload Deliverables
   │   ├─→ Request Review
   │   └─→ Request Payment
   │
   └─→ Complete Project
       └─→ Receive Payment & Review
```

#### 4. **Communication**
```
Navbar → Messages (/messages)
   │
   ├─→ View Conversations
   │   ├─→ Active Clients
   │   ├─→ Potential Clients
   │   └─→ Admin Support
   │
   ├─→ Send Messages
   │   ├─→ Discuss Requirements
   │   ├─→ Share Files
   │   └─→ Negotiate Terms
   │
   └─→ Receive Notifications
       └─→ New Message Alerts
```

---

## 💼 Business User Journey

### After Login - Business Dashboard
```
Login Success → Dashboard (/dashboard)
   │
   ├─→ View Stats Overview
   │   ├─→ Active Projects: 0
   │   ├─→ Total Spent: $0
   │   ├─→ Messages: 0
   │   └─→ Reviews: 0
   │
   ├─→ Quick Actions
   │   ├─→ Post New Project (Coming Soon)
   │   ├─→ Browse Designers → /browse
   │   └─→ View Proposals (Coming Soon)
   │
   └─→ Recent Projects
       └─→ View posted projects
```

### Business Main Workflows

#### 1. **Finding Designers**
```
Dashboard/Navbar → Browse Designers (/browse)
   │
   ├─→ Search & Filter Designers
   │   ├─→ Search by Name
   │   ├─→ Filter by Skill
   │   ├─→ Filter by Location
   │   ├─→ Filter by Rate (Min/Max)
   │   └─→ View Results
   │
   ├─→ View Designer Profile
   │   ├─→ View Portfolio
   │   ├─→ Read Bio
   │   ├─→ Check Skills
   │   ├─→ View Hourly Rate
   │   ├─→ Check Rating
   │   └─→ See Completed Projects
   │
   ├─→ Contact Designer
   │   ├─→ Send Message
   │   ├─→ Request Quote
   │   └─→ Hire Directly
   │
   └─→ Save to Favorites
       └─→ Quick Access Later
```

#### 2. **Posting a Project**
```
Dashboard → Post New Project
   │
   ├─→ Fill Project Details
   │   ├─→ Project Title
   │   ├─→ Description
   │   ├─→ Category
   │   ├─→ Budget Range
   │   ├─→ Timeline/Deadline
   │   └─→ Required Skills
   │
   ├─→ Add Attachments
   │   ├─→ Reference Images
   │   ├─→ Brand Guidelines
   │   └─→ Sample Files
   │
   ├─→ Review & Post
   │   └─→ Project Goes Live
   │
   └─→ Receive Proposals
       └─→ Notifications → Messages
```

#### 3. **Managing Proposals**
```
Dashboard → View Proposals
   │
   ├─→ Review Received Proposals
   │   ├─→ View Designer Profile
   │   ├─→ Check Proposed Price
   │   ├─→ Review Timeline
   │   └─→ Read Cover Letter
   │
   ├─→ Compare Proposals
   │   ├─→ Price Comparison
   │   ├─→ Rating Comparison
   │   └─→ Portfolio Review
   │
   ├─→ Accept Proposal
   │   ├─→ Send Acceptance
   │   ├─→ Initiate Payment Escrow
   │   └─→ Project Starts
   │
   └─→ Reject/Archive
       └─→ Send Polite Decline
```

#### 4. **Project Management & Payment**
```
Active Project → Project Detail (/listing/:id)
   │
   ├─→ Monitor Progress
   │   ├─→ View Milestones
   │   ├─→ Check Deadlines
   │   └─→ Track Updates
   │
   ├─→ Communicate
   │   └─→ Messages → Chat with Designer
   │
   ├─→ Review Deliverables
   │   ├─→ Approve Work
   │   ├─→ Request Revisions
   │   └─→ Provide Feedback
   │
   ├─→ Complete & Pay
   │   └─→ Checkout (/checkout/:orderId)
   │       ├─→ Review Order Details
   │       ├─→ Process Payment
   │       └─→ Release Funds from Escrow
   │
   └─→ Leave Review
       ├─→ Rate Designer (1-5 stars)
       ├─→ Write Review
       └─→ Submit Feedback
```

---

## 🔐 Admin User Journey

### Admin Panel Access
```
Login (Admin Account) → Dashboard → Admin Panel (/admin)
   │
   ├─→ User Management
   │   ├─→ View All Users
   │   ├─→ Suspend/Ban Users
   │   ├─→ Verify Accounts
   │   └─→ Handle Disputes
   │
   ├─→ Project Monitoring
   │   ├─→ View All Projects
   │   ├─→ Flag Inappropriate Content
   │   └─→ Resolve Issues
   │
   ├─→ Payment Management
   │   ├─→ Monitor Transactions
   │   ├─→ Handle Escrow Disputes
   │   └─→ Process Refunds
   │
   ├─→ Platform Analytics
   │   ├─→ User Growth Stats
   │   ├─→ Transaction Volume
   │   ├─→ Popular Categories
   │   └─→ Revenue Reports
   │
   └─→ Content Moderation
       ├─→ Review Reports
       ├─→ Remove Violations
       └─→ Send Warnings
```

---

## 🔄 Common User Actions

### Navigation Flow
```
ANY PAGE
   │
   ├─→ Navbar (Always Accessible)
   │   ├─→ ShockWave Logo → Home
   │   ├─→ Browse Designers → /browse
   │   ├─→ Find Work → /listings
   │   ├─→ Dashboard → /dashboard (if logged in)
   │   ├─→ Messages → /messages (if logged in)
   │   ├─→ Login/Register (if not logged in)
   │   └─→ Logout (if logged in)
   │
   └─→ Footer (Always Accessible)
       ├─→ For Designers Links
       ├─→ For Businesses Links
       ├─→ Social Media Links
       └─→ Legal Pages (Privacy, Terms, Contact)
```

### Search & Filter Flow
```
Browse Page (/browse)
   │
   ├─→ Enter Search Query
   │   └─→ Search by designer name, skills, or keywords
   │
   ├─→ Apply Filters
   │   ├─→ Skill Filter (e.g., "logo design")
   │   ├─→ Location Filter
   │   ├─→ Rate Range (Min/Max)
   │   └─→ Rating Filter
   │
   ├─→ View Results
   │   ├─→ Grid of Designer Cards
   │   ├─→ Hover for Preview
   │   └─→ Click "View Profile"
   │
   └─→ Refine Search
       └─→ Adjust filters until match found
```

### Messaging Flow
```
Messages Page (/messages)
   │
   ├─→ View Conversation List
   │   ├─→ Active Chats
   │   ├─→ Unread Messages (highlighted)
   │   └─→ Search Conversations
   │
   ├─→ Select Conversation
   │   ├─→ View Message History
   │   ├─→ View User Profile
   │   └─→ See Online Status
   │
   ├─→ Send Message
   │   ├─→ Type Message
   │   ├─→ Attach Files (optional)
   │   ├─→ Add Emojis (optional)
   │   └─→ Press Send
   │
   └─→ Receive Notifications
       ├─→ Browser Notification
       ├─→ In-app Badge
       └─→ Email Notification (optional)
```

---

## 🎯 Complete User Journey Examples

### Example 1: Business Hiring a Designer

```
1. Visit ShockWave → Home Page
2. Click "Get Started" → Register Page
3. Create Account (Select "Business")
4. Redirected to Dashboard
5. Click "Browse Designers" from Dashboard
6. Apply Filters:
   - Skill: "logo design"
   - Rate: $30-$60/hr
   - Location: Any
7. Browse Results → Find suitable designer
8. Click "View Profile" → Review portfolio
9. Click "Contact" → Send message via Messages page
10. Discuss requirements → Agree on terms
11. Designer sends proposal
12. Accept Proposal → Project starts
13. Monitor progress via Dashboard
14. Designer submits work
15. Review & approve deliverables
16. Complete payment via Checkout
17. Leave 5-star review
18. Project complete! ✅
```

### Example 2: Designer Finding Work

```
1. Visit ShockWave → Home Page
2. Click "Sign Up" → Register Page
3. Create Account (Select "Designer")
4. Redirected to Dashboard
5. Click "Update Portfolio"
6. Add bio, skills, rate, portfolio items
7. Click "Browse Projects" or "Find Work"
8. Filter by:
   - Category: Branding
   - Budget: $500-$2000
9. Find interesting project
10. Click to view details
11. Submit proposal with:
    - Cover letter
    - Proposed price
    - Timeline
12. Business reviews proposal
13. Proposal accepted → Notification
14. Start working on project
15. Upload progress updates
16. Chat with client via Messages
17. Submit final deliverables
18. Receive payment
19. Get 5-star review
20. Build reputation! ✅
```

### Example 3: Quick Browse (Non-registered User)

```
1. Visit ShockWave → Home Page
2. Click "Browse Designers" (no login required)
3. View all designers
4. Apply filters to narrow search
5. View designer profiles
6. Decide to hire → Redirected to Register/Login
7. Complete registration
8. Continue with hiring process
```

---

## 🔑 Key Features & Benefits

### For Designers
- ✅ Create professional portfolio
- ✅ Set your own rates
- ✅ Find projects matching your skills
- ✅ Secure payment via escrow
- ✅ Build reputation through reviews
- ✅ Direct client communication

### For Businesses
- ✅ Access pool of talented designers
- ✅ Filter by skills, rate, location
- ✅ Review portfolios & ratings
- ✅ Secure payments with buyer protection
- ✅ Direct project management
- ✅ Post unlimited projects

### Platform Safety
- 🔒 **Secure Payments**: Escrow protection
- 💬 **Direct Communication**: Built-in messaging
- ⭐ **Rating System**: Quality assurance
- 🛡️ **Dispute Resolution**: Admin support
- ✅ **Verified Accounts**: Trust & safety

---

## 📱 Mobile Experience

All pages are fully responsive with:
- Touch-friendly navigation
- Mobile-optimized forms
- Swipe gestures support
- Bottom navigation for quick access
- Full-screen mobile layouts

---

## 🚀 Future Enhancements

Upcoming features in the flow:
- Advanced search with AI recommendations
- Video calls for consultations
- Milestone-based payments
- Team collaboration features
- Integration with design tools
- Mobile app (iOS & Android)
- Portfolio templates
- Contract generation
- Time tracking
- Invoice management

---

## 📞 Support & Help

Users can get help through:
- **Messages**: Contact support team
- **Footer Links**: Help Center, FAQ
- **Admin Panel**: For urgent issues
- **Email**: support@shockwave.com

---

## 🎨 Visual Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│                        HOME PAGE                             │
│  Hero → Features → CTA → Footer                             │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
         ┌─────▼─────┐                  ┌────▼─────┐
         │  REGISTER │                  │  BROWSE  │
         └─────┬─────┘                  │ DESIGNERS│
               │                        └────┬─────┘
         ┌─────▼─────┐                       │
         │   LOGIN   │◄──────────────────────┘
         └─────┬─────┘
               │
    ┌──────────▼──────────┐
    │     DASHBOARD       │
    │  (Role-based view)  │
    └──┬────────┬────────┬┘
       │        │        │
   ┌───▼──┐ ┌──▼───┐ ┌──▼────┐
   │BROWSE│ │MSGS  │ │PROFILE│
   │      │ │      │ │       │
   └───┬──┘ └──────┘ └───────┘
       │
   ┌───▼────────┐
   │  PROJECT   │
   │  DETAIL    │
   └───┬────────┘
       │
   ┌───▼────────┐
   │  CHECKOUT  │
   │  & PAYMENT │
   └────────────┘
```

---

**End of User Flow Guide** 🌊

*Last Updated: November 3, 2025*
