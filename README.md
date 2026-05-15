# 🔧 HomeFixApp

A full-stack home services marketplace that connects customers with verified technicians. Customers can browse technicians, book service appointments, track job progress, chat in real-time, and leave reviews — all in one platform.

---

## ✨ Features

### For Customers
- Browse and search for technicians by service or specialty
- View technician public profiles with ratings and reviews
- Book service appointments with date, time, and job description
- Track job status in real-time (Requested → Accepted → In Progress → Completed)
- Cancel pending requests
- Chat directly with technicians
- Report users

### For Technicians
- Apply to become a partner via a dedicated signup flow
- Manage availability and incoming service requests
- Accept, reject, or update job statuses
- Receive job completion tracking and review ratings
- Chat with customers

### For Admins
- Dashboard overview with platform statistics
- Manage and verify technician applications
- View and moderate all users, jobs, and reports
- Admin-only protected routes

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| React Router v7 | Client-side routing |
| Tailwind CSS v4 | Styling |
| Axios | HTTP requests |
| Firebase (Client) | Auth & real-time features |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| Firebase Admin SDK | Firestore database & auth verification |
| Cloudinary + Multer | Image uploads |
| JSON Web Token (JWT) | Session management |
| Nodemailer | Email notifications |

---

## 📁 Project Structure

```
HomeFixApp/
├── frontend/
│   └── src/
│       ├── components/       # Reusable UI components
│       │   ├── admin/        # Admin-specific components
│       │   ├── auth/         # Login, Register, ForgotPassword
│       │   ├── common/       # Navbar, Sidebar, Modals, etc.
│       │   ├── reviews/      # Review list and add review
│       │   └── technician/   # Technician cards and filters
│       ├── context/          # AuthContext, TechnicianContext
│       ├── hooks/            # Custom hooks (useAuth)
│       ├── pages/            # Route-level pages
│       │   ├── admin/        # Admin dashboard pages
│       │   ├── customer/     # Customer dashboard and jobs
│       │   └── technician/   # Technician dashboard and jobs
│       ├── routes/           # Protected route wrapper
│       └── services/         # API call functions (axios)
│
└── backend/
    └── src/
        ├── config/           # Firebase & Cloudinary setup
        ├── controllers/      # Business logic per feature
        ├── middleware/        # Auth, role, and upload middleware
        ├── routes/           # Express route definitions
        └── utils/            # Email service, admin bootstrap
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Firebase project with Firestore enabled
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/HomeFixApp.git
cd HomeFixApp
```

### 2. Set up environment variables

**Backend** — create `backend/.env`:
```env
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### 3. Install dependencies
```bash
npm install           # root (installs concurrently)
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run the development server
```bash
# From root — starts both frontend and backend
npm run dev
```

Frontend runs on `http://localhost:5173`  
Backend runs on `http://localhost:5000`

---

## 🔐 User Roles

| Role | Access |
|---|---|
| `customer` | Browse technicians, book jobs, chat, review |
| `technician` | Manage jobs, availability, and profile |
| `admin` | Full platform access, user and job management |

---

## 📬 API Overview

| Endpoint | Description |
|---|---|
| `POST /api/auth` | Register / Login |
| `GET /api/technician` | List technicians |
| `POST /api/jobs` | Create a service request |
| `PATCH /api/jobs/:id` | Update job status |
| `GET /api/chat` | Get user's chats |
| `POST /api/chat/:id/messages` | Send a message |
| `GET /api/rating` | Get technician ratings |
| `POST /api/reports` | Report a user |
| `GET /api/admin/*` | Admin-only routes |

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
