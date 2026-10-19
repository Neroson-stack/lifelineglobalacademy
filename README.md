# LIFELINE GLOBAL ACADEMY – Student Management System

Online multi-role Student Management System for **LIFELINE GLOBAL ACADEMY**.

## Features

| Module | Capabilities |
|--------|--------------|
| **Students** | Full profile (form, class, desired subject, guardian), status management |
| **Enrolment** | Academic year enrolment with subjects |
| **Payments** | Class fee recording with date, method, reference |
| **Finance** | Full income + expense ledger (auto-links fee payments as income) |
| **Academic Performance** | Test name/topic, date, score, auto PROGRESSING / REGRESSING / STABLE |
| **Attendance** | Daily + bulk marking (Present / Absent / Late / Excused) |
| **Reports** | PDF (student lists, academic reports) + Excel (students, payments) |
| **Security** | JWT auth + role-based access (Main Admin, Teacher, Finance Officer) |

## User Roles

| Role | Access |
|------|--------|
| **MAIN_ADMIN** | Full system access (users, students, finance, academics, reports) |
| **TEACHER** | Students, enrolment, academic records, attendance, view payments |
| **FINANCE_OFFICER** | Payments, finance ledger, related reports |

## Tech Stack

- **Backend**: Node.js + Express
- **Frontend**: React + Vite (role-based SPA)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT + bcrypt
- **Reports**: PDFKit (PDF) + ExcelJS (Excel)
- **Deployment**: Docker Compose / Railway / Render / Fly.io + managed Postgres

---

## Option A – One-Command Docker (Recommended)

```bash
cd lifeline-global-academy
docker compose up -d --build
```

- API: http://localhost:4000/api  
- Postgres: localhost:5432 (user `lga` / password `lga_secret_2026`)

Then seed demo data:

```bash
docker compose exec api node scripts/seed.js
```

Start the frontend (separate terminal):

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## Option B – Local without Docker

### 1. Prerequisites
- Node.js 18+
- PostgreSQL database (local or cloud)

### 2. Backend setup

```bash
cd lifeline-global-academy
cp .env.example .env
# Edit .env and set DATABASE_URL and JWT_SECRET
```

Example `DATABASE_URL`:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/lifeline_academy?schema=public"
```

### 3. Install & Database

```bash
npm install
npx prisma generate
npx prisma db push          # creates tables
npm run db:seed             # sample data + users
```

### 4. Run API

```bash
npm run dev                 # development with nodemon
# or
npm start
```

API runs at `http://localhost:4000/api`

### 5. Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 (proxies `/api` to the backend)
---

## Default Login Credentials (after seed)

| Role | Email | Password |
|------|-------|----------|
| Main Administrator | admin@lifeline.academy | Password123! |
| Teacher | teacher@lifeline.academy | Password123! |
| Finance Officer | finance@lifeline.academy | Password123! |

---

## API Overview

Base path: `/api`

### Auth
- `POST /auth/login` – `{ email, password }` → token + user
- `GET /auth/me` – current user (Bearer token)
- `POST /auth/users` – create user (MAIN_ADMIN only)

### Students
- `GET /students?form=&class=&status=&search=&page=&limit=`
- `GET /students/:id`
- `POST /students`
- `PATCH /students/:id`
- `POST /students/:id/enrol` – `{ academicYear, form, class, subjects[] }`

### Payments
- `GET /payments`
- `POST /payments` – `{ studentId, amount, paymentDate, paymentMethod, ... }`
- `GET /payments/student/:studentId`

### Finance
- `GET /finance`
- `POST /finance` – `{ type: "INCOME"|"EXPENSE", category, amount, transactionDate }`
- `GET /finance/dashboard`

### Academic
- `GET /academic`
- `POST /academic` – `{ studentId, testName, subject, testDate, score, ... }`
- `GET /academic/student/:studentId/progress`

### Attendance
- `GET /attendance`
- `POST /attendance` – `{ studentId, date, status }`
- `POST /attendance/bulk` – `{ date, records: [{ studentId, status }] }`
- `GET /attendance/summary?studentId=`

### Reports
- `GET /reports/students/pdf`
- `GET /reports/students/excel`
- `GET /reports/payments/excel`
- `GET /reports/academic/:studentId/pdf`

All protected routes require header:
```
Authorization: Bearer <token>
```

---

## Online Deployment (Recommended Path)

### Option A – Railway / Render (simplest)
1. Create a PostgreSQL database on Railway or Supabase → copy `DATABASE_URL`
2. Create a new Web Service, connect this repo
3. Set environment variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV=production`
4. Build command: `npm install && npx prisma generate && npx prisma db push`
5. Start command: `npm start`
6. Run seed once via one-off command or SSH: `npm run db:seed`

### Option B – Supabase + Vercel / Railway
- Use Supabase for Postgres + Auth (optional later)
- Deploy this Express API on Railway/Render
- Build a React/Next.js frontend separately and point it at the API

### Frontend (next step)
A React or Next.js frontend can be added that:
- Logs in and stores the JWT
- Shows role-based dashboards
- Calls the endpoints above
- Triggers PDF/Excel downloads

---

## Project Structure

```
lifeline-global-academy/
├── docker-compose.yml     # Postgres + API
├── Dockerfile
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── pages/         # Dashboard, Students, Payments, Finance, Academic, Attendance, Reports
│   │   ├── services/      # API client + Auth context
│   │   └── styles/
│   └── package.json
├── prisma/
│   ├── schema.prisma      # Prisma models
│   └── schema.sql         # Pure SQL equivalent
├── src/
│   ├── controllers/       # Business logic
│   ├── middleware/        # Auth & role guards
│   ├── routes/            # API routes
│   ├── utils/             # Prisma client, auth helpers
│   └── server.js          # Entry point
├── scripts/
│   └── seed.js            # Demo data + users
├── .env.example
├── package.json
└── README.md
```

---

## Performance Status Logic

When a new academic record is created for a subject, the system compares the new score with the previous score in the same subject:

- Score ↑ by more than 2 points → **PROGRESSING**
- Score ↓ by more than 2 points → **REGRESSING**
- Otherwise → **STABLE**

---

## Next Steps You Can Request

1. Full React / Next.js frontend with role-based dashboards
2. Docker Compose for one-command local run
3. More report templates (class attendance sheets, fee statements)
4. Email notifications for fee reminders
5. Parent portal (read-only)

---

**LIFELINE GLOBAL ACADEMY Student Management System** – ready for online deployment.
