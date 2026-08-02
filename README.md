
# HealthHub — Full-Stack Patient Portal

A full-stack healthcare portal enabling patient registration, appointment scheduling, and medicine tracking. Built as a hackathon prototype and later extended with a real backend, authentication, and database.

**Live Demo:** _Not currently deployed — run locally following the instructions below._

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- Fetch API (via a lightweight custom wrapper) for backend communication

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (httpOnly cookies)
- bcrypt for password hashing

---

## Features

- **Authentication** — Secure registration and login with hashed passwords and JWT sessions stored in httpOnly cookies (not accessible to client-side JavaScript, protecting against XSS token theft)
- **Appointment Booking** — Book appointments with available doctors, filtered by real per-doctor time slots
- **Double-Booking Prevention** — Enforced at the database level via a MongoDB unique compound index (doctor + date + time), so it holds even under concurrent requests
- **Slot Validation** — Server-side check confirms a doctor actually offers the requested time slot, independent of frontend restrictions
- **Medicine Tracker** — View prescribed medicines with automatically computed Active/Inactive status based on date ranges
- **Shared Auth State** — A React Context provider (`AuthProvider`) keeps navigation, protected routes, and the dashboard consistently in sync with the current login state
- **Responsive Design** — Fully responsive UI with light/dark theme support

---

## Project Structure

```
healthhub-fullstack/
├── frontend/                  # Next.js application
│   ├── app/                   # Routes (App Router)
│   │   ├── about/
│   │   ├── contact/
│   │   ├── dashboard/
│   │   ├── signin/
│   │   └── signup/
│   ├── components/
│   │   ├── dashboard/         # Feature components (booking, history, medicines)
│   │   └── ui/                # shadcn/ui primitives
│   ├── lib/
│   │   ├── api.ts             # Fetch wrapper for backend calls
│   │   ├── auth-context.tsx   # Shared authentication state (React Context)
│   │   └── doctors.ts         # Shared doctor/specialty/slot data
│   └── hooks/
│
└── backend/                   # Express API
    ├── config/
    │   ├── db.js               # MongoDB connection
    │   └── doctors.js          # Server-side doctor/slot source of truth
    ├── models/                 # Mongoose schemas (User, Appointment, Medicine)
    ├── middleware/
    │   └── auth.js              # JWT verification middleware
    ├── controllers/             # Business logic per resource
    ├── routes/                  # Express route definitions
    └── server.js                 # App entry point
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database (e.g., a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev
```
Runs on `http://localhost:5000`. Confirm it's alive at `http://localhost:5000/api/health`.

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm run dev
```
Runs on `http://localhost:3000`.

---

## API Reference

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create a new account |
| POST | `/api/auth/login` | No | Log in, sets session cookie |
| POST | `/api/auth/logout` | No | Clears session cookie |
| GET | `/api/auth/me` | Yes | Get current authenticated user |
| GET | `/api/appointments` | Yes | List the current user's appointments |
| POST | `/api/appointments` | Yes | Book a new appointment |
| GET | `/api/medicines` | Yes | List the current user's medicines |
| POST | `/api/medicines` | Yes | Add a new medicine |

---

## Security Notes

- Passwords are hashed with bcrypt before storage — never stored in plaintext
- JWTs are stored in httpOnly cookies, inaccessible to client-side JavaScript
- User identity for all protected actions is derived from the verified JWT, never trusted from the request body
- Double-booking is prevented at the database level (unique index), not just in application logic, to remain correct under concurrent requests

---

## Known Limitations

- Not currently deployed — designed to be run locally
- No email verification on registration
- No password reset flow
- Doctor/specialty data is static (hardcoded), not database-managed
- No automated test suite yet

---

## License

This project was built for educational and portfolio purposes.
