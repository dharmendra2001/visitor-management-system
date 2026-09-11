# Visitor Management System - Backend

Backend API for Visitor Management Mini System built with NestJS, TypeScript, MySQL, and Prisma ORM.

## Tech Stack
- Node.js & NestJS
- TypeScript
- MySQL
- Prisma ORM
- JWT Authentication & Passport
- Class Validator

---

## Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL="mysql://root:@localhost:3306/visitor_management_system"
JWT_SECRET="vms_secret_key_2026"
JWT_EXPIRES_IN="1d"
```

### 3. Database Migration & Seeding
Make sure MySQL is running on port 3306 and run:
```bash
# Push schema to database
npx prisma db push

# Seed default users and sample data
npm run prisma:seed
```

### 4. Run the Project
```bash
# Development mode
npm run start:dev

# Production build & run
npm run build
npm run start:prod
```

API will be running on `http://localhost:5000`

---

## Seed Users (For Testing)

| Role | Email | Password |
|---|---|---|
| Admin | admin@vms.com | Admin@123 |
| Receptionist | receptionist@vms.com | Staff@123 |
| Host / Employee | amit.patel@vms.com | Host@123 |

---

## API Endpoints

### Auth
- `POST /auth/login` - Login with email & password, returns JWT token
- `POST /auth/register` - Register new user/staff
- `GET /auth/me` - Get logged-in user profile (Requires Bearer Token)

### Visitors
- `POST /visitors` - Create visitor entry (Status: `PENDING`)
- `GET /visitors` - Get all visitors (Supports query params: `search`, `status`, `page`, `limit`)
- `GET /visitors/:id` - Get single visitor details by ID
- `PUT /visitors/:id` - Update visitor details
- `DELETE /visitors/:id` - Delete visitor record (Admin only)
- `PATCH /visitors/:id/approve` - Approve or Reject visitor (`status`: `APPROVED` | `REJECTED`)

### Users
- `GET /users` - List all staff/hosts (e.g. `?role=HOST`)
- `GET /users/:id` - Get user details
- `POST /users` - Create user (Admin only)
- `PUT /users/:id` - Update user (Admin only)
- `DELETE /users/:id` - Delete user (Admin only)
