# 🌐 JobSphere — Full-Stack MERN Job Portal

A complete, production-ready job portal built with the MERN stack (MongoDB, Express.js, React.js + Vite, Node.js) and styled with Tailwind CSS v4.

---

## 📁 Project Structure

```
job-portal/
├── backend/                    # Node.js + Express REST API
│   ├── controllers/            # Route handler logic
│   │   ├── auth.controller.js
│   │   ├── job.controller.js
│   │   ├── application.controller.js
│   │   ├── user.controller.js
│   │   └── admin.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT protect + adminOnly
│   │   └── upload.middleware.js # Multer file uploads
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── job.routes.js
│   │   ├── application.routes.js
│   │   ├── user.routes.js
│   │   └── admin.routes.js
│   ├── utils/
│   │   └── db.js               # MongoDB connection
│   ├── seed.js                 # Database seeder
│   ├── server.js               # App entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/                   # React + Vite + Tailwind CSS v4
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── JobCard.jsx
    │   │   │   ├── Spinner.jsx
    │   │   │   ├── Pagination.jsx
    │   │   │   └── Modal.jsx
    │   │   └── layout/
    │   │       ├── Layout.jsx
    │   │       ├── Navbar.jsx
    │   │       └── Footer.jsx
    │   ├── context/
    │   │   ├── authStore.js    # Zustand auth state
    │   │   └── themeStore.js  # Dark/light mode
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── JobsPage.jsx
    │   │   ├── JobDetailPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── UserDashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminJobs.jsx
    │   │   ├── AdminUsers.jsx
    │   │   ├── AdminApplications.jsx
    │   │   └── NotFound.jsx
    │   ├── utils/
    │   │   └── api.js          # Axios instance
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css           # Tailwind v4 + custom tokens
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

---

### 1. Clone & Install

```bash
# Backend
cd backend
cp .env.example .env         # Edit MONGODB_URI and JWT_SECRET
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Seed the Database

```bash
cd backend
node seed.js
```

This creates:
- **Admin**: `admin@jobsphere.com` / `admin123`
- **User**: `user@jobsphere.com` / `user1234`
- 6 sample job listings

### 4. Run the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # Runs on http://localhost:5000

# Terminal 2 — Frontend
cd frontend
npm run dev        # Runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## ✨ Features

### 👤 User Features
- Register / Login with JWT auth
- Browse & search jobs by keyword, location, category
- Filter by job type, salary range, experience level
- View detailed job info (description, requirements, skills)
- Apply for jobs with cover letter + resume upload
- Withdraw pending applications
- Save / bookmark jobs
- User dashboard with application tracking
- Profile update (name, phone, location, bio, skills)
- Resume upload (PDF/DOC)
- Application status tracking (pending → reviewing → shortlisted → accepted/rejected)
- Dark / Light mode toggle

### 🛡️ Admin Features
- Admin dashboard with stats overview
- Post / Edit / Delete job listings
- Toggle job active/inactive status
- View all registered users
- View & manage all applications
- Update application status
- Search & filter across all data

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v4         |
| State      | Zustand                                 |
| Routing    | React Router v6                         |
| HTTP       | Axios                                   |
| Toast      | React Hot Toast                         |
| Icons      | React Icons (Feather)                   |
| Backend    | Node.js, Express.js                     |
| Auth       | JWT (jsonwebtoken + bcryptjs)           |
| Database   | MongoDB + Mongoose                      |
| Uploads    | Multer                                  |
| Fonts      | Syne (display) + DM Sans (body)        |

---

## 🔌 API Reference

### Auth
| Method | Endpoint           | Auth | Description       |
|--------|--------------------|------|-------------------|
| POST   | /api/auth/register | No   | Create account    |
| POST   | /api/auth/login    | No   | Login             |
| GET    | /api/auth/me       | Yes  | Current user      |

### Jobs
| Method | Endpoint          | Auth       | Description       |
|--------|-------------------|------------|-------------------|
| GET    | /api/jobs         | No         | List jobs (filter)|
| GET    | /api/jobs/featured| No         | Featured jobs     |
| GET    | /api/jobs/:id     | No         | Job details       |
| POST   | /api/jobs         | Admin only | Create job        |
| PUT    | /api/jobs/:id     | Admin only | Update job        |
| DELETE | /api/jobs/:id     | Admin only | Delete job        |

### Applications
| Method | Endpoint                       | Auth       | Description       |
|--------|--------------------------------|------------|-------------------|
| POST   | /api/applications/apply        | User       | Apply for job     |
| GET    | /api/applications/my           | User       | My applications   |
| GET    | /api/applications/job/:jobId   | Admin      | Job's applicants  |
| PUT    | /api/applications/:id/status   | Admin      | Update status     |
| DELETE | /api/applications/:id          | User       | Withdraw          |

### User
| Method | Endpoint                | Auth | Description      |
|--------|-------------------------|------|------------------|
| PUT    | /api/users/profile      | User | Update profile   |
| POST   | /api/users/resume       | User | Upload resume    |
| POST   | /api/users/save/:jobId  | User | Save/unsave job  |
| GET    | /api/users/saved-jobs   | User | Get saved jobs   |
| PUT    | /api/users/change-password | User | Change password |

### Admin
| Method | Endpoint                    | Auth  | Description     |
|--------|-----------------------------|-------|-----------------|
| GET    | /api/admin/stats            | Admin | Dashboard stats |
| GET    | /api/admin/users            | Admin | All users       |
| GET    | /api/admin/applications     | Admin | All applications|

---

## 🎨 Design System

- **Primary font**: Syne (headings)
- **Body font**: DM Sans
- **Colors**: Custom primary-* palette (indigo/blue-violet) + emerald accents
- **Tailwind v4**: Uses `@tailwindcss/vite` plugin with `@theme {}` configuration
- **Dark mode**: Class-based (`dark:`), persisted to localStorage
- **Components**: `.card`, `.btn-primary`, `.btn-secondary`, `.input`, `.badge-*`, `.label`

---

## 📦 Production Build

```bash
# Build frontend
cd frontend
npm run build

# Serve backend (configure to also serve /dist if needed)
cd backend
npm start
```

---

## 📝 License

MIT — free to use and modify.
