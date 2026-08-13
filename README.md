# HealthHub — Full-Stack Patient Portal

A full-stack healthcare portal for patient registration, appointment scheduling, medicine tracking, and AI-assisted support — built as a hackathon prototype and extended into a production-style full-stack application with real authentication, a live database, and a deployed backend API.

**Live Demo:** https://health-hub-fullstack-f1ud.vercel.app/

---

## Tech Stack

**Frontend**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4 + shadcn/ui (Radix UI primitives)
- Fetch API (via a lightweight custom wrapper) for backend communication
- Deployed on **Vercel**

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (httpOnly, cross-domain cookies)
- bcrypt for password hashing
- Google OAuth 2.0 (Google Identity Services + `google-auth-library`)
- Google Gemini API for the in-app patient assistant
- Deployed on **Render**

---

## Features

### Authentication
- Email/password signup and login with bcrypt-hashed passwords
- **Google Sign-In** — verified server-side via Google's ID token verification, auto-links to an existing account by email or creates a new one
- JWT sessions in httpOnly, `sameSite=none` cookies (secure cross-domain auth between the Vercel frontend and Render backend)
- Route protection enforced by checking a live, server-verified session — not a client-side flag

### Appointments
- Book an appointment with a real doctor, date, and time slot
- **Live slot availability** — already-booked times are shown in red and disabled in real time, checked against the database as the user picks a doctor and date
- **Double-booking prevention** enforced at the database level via a partial unique MongoDB index (doctor + date + time, scoped to non-cancelled appointments only)
- **Cancel** an appointment (with confirmation), which correctly frees up that time slot for rebooking
- **Reschedule** an appointment to a new date/time, re-validated against real doctor availability and the same anti-double-booking guarantees
- **Remove** a cancelled appointment permanently from history

### Medicines
- Add a medicine to track (name, dosage, frequency, date range) via a real form — not manually seeded
- View tracked medicines with automatically computed Active/Inactive status

### AI Patient Assistant
- In-dashboard chatbot (Google Gemini API) that can answer questions using the patient's **real, live appointment and medicine data**
- Strictly scoped via system prompt to only describe features that actually exist in the app — prevents the bot from hallucinating unsupported functionality
- Hard safety guardrails: never diagnoses, never recommends medication or dosage, and redirects any emergency-sounding message straight to seeking urgent care
- Data access is scoped per-user via the same JWT-based auth as every other route

### UX
- Fully responsive, light/dark theme support
- Click-anywhere date picker
- Real-time character-limited appointment reason field

---

## Project Structure

```
healthhub-fullstack/
├── healthHub-frontend/        # Next.js application
│   ├── app/                   # Routes (App Router)
│   │   ├── about/
│   │   ├── contact/
│   │   ├── dashboard/
│   │   ├── signin/
│   │   └── signup/
│   ├── components/
│   │   ├── dashboard/         # Booking, history, medicines, chatbot
│   │   ├── google-signin-button.tsx
│   │   └── ui/                # shadcn/ui primitives
│   ├── lib/
│   │   ├── api.ts             # Fetch wrapper for backend calls
│   │   ├── auth-context.tsx   # Shared authentication state (React Context)
│   │   └── doctors.ts         # Shared doctor/specialty/slot data
│   └── hooks/
│
└── healthHub-backend/          # Express API
    ├── config/
    │   ├── db.js                # MongoDB connection
    │   └── doctors.js           # Server-side doctor/slot source of truth
    ├── models/                  # Mongoose schemas (User, Appointment, Medicine)
    ├── middleware/
    │   └── auth.js               # JWT verification middleware
    ├── controllers/              # Business logic (auth, appointments, medicines, chat)
    ├── routes/                   # Express route definitions
    └── server.js                  # App entry point
```

---

## Getting Started (local development)

### Prerequisites
- Node.js 18+
- A MongoDB database ([MongoDB Atlas](https://www.mongodb.com/atlas) free tier works)
- A free [Google Gemini API key](https://aistudio.google.com)
- A [Google OAuth Client ID](https://console.cloud.google.com)

### 1. Backend Setup

```bash
cd healthHub-backend
npm install
cp .env.example .env
```

Fill in `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=a_long_random_string
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite
GOOGLE_CLIENT_ID=your_google_client_id
```

```bash
npm run dev
```
Runs on `http://localhost:5000`. Confirm it's alive at `http://localhost:5000/api/health`.

### 2. Frontend Setup

```bash
cd healthHub-frontend
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
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
| POST | `/api/auth/google` | No | Sign in with a verified Google ID token |
| POST | `/api/auth/logout` | No | Clears session cookie |
| GET | `/api/auth/me` | Yes | Get current authenticated user |
| GET | `/api/appointments` | Yes | List the current user's appointments |
| GET | `/api/appointments/availability` | Yes | Check which slots are already booked for a doctor/date |
| POST | `/api/appointments` | Yes | Book a new appointment |
| PATCH | `/api/appointments/:id/cancel` | Yes | Cancel an appointment |
| PATCH | `/api/appointments/:id/reschedule` | Yes | Change an appointment's date/time |
| DELETE | `/api/appointments/:id` | Yes | Permanently remove a cancelled appointment |
| GET | `/api/medicines` | Yes | List the current user's medicines |
| POST | `/api/medicines` | Yes | Add a new medicine |
| POST | `/api/chat` | Yes | Ask the AI patient assistant a question |

---

## Security Notes

- Passwords are bcrypt-hashed before storage — never stored in plaintext; Google-authenticated accounts store no password at all
- Google Sign-In tokens are verified server-side against Google's servers before being trusted — never accepted at face value
- JWTs are stored in httpOnly, `secure`, `sameSite=none` cookies — inaccessible to client-side JavaScript, safe across the Vercel/Render domain split
- User identity for all protected actions is derived from the verified JWT, never trusted from the request body
- Double-booking is prevented at the database level (a partial unique index scoped to active appointments), not just in application logic, so it holds under concurrent requests
- Every appointment/medicine mutation includes an ownership check — a user can only modify their own records, even if they know another record's ID
- The AI assistant's system prompt explicitly restricts it to real, existing app features and forbids medical diagnosis or dosage recommendations

---

## Known Limitations

- No email verification on password-based registration
- No password reset flow
- Doctor/specialty data is static (hardcoded), not database-managed
- Backend is on Render's free tier, which sleeps after inactivity — the first request after idle time may take 30–60 seconds
- No automated test suite yet

---

## License

This project was built for educational and portfolio purposes.
