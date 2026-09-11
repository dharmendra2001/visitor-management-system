# Visitor Management System - Backend API

A NestJS and TypeScript REST API for handling visitor check-ins, employee host assignments, and approval workflows (`PENDING`, `APPROVED`, `REJECTED`) with JWT authentication and role-based access control.

---

## Tech Stack

- **Framework:** NestJS (Node.js v20+)
- **Language:** TypeScript
- **Database:** MySQL
- **ORM:** Prisma ORM
- **Auth:** JWT (Passport-jwt, bcrypt)
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger (OpenAPI 3.0)
- **Testing:** Jest

---

## Project Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MySQL Server (e.g. Laragon, XAMPP, or standalone MySQL on port 3306)

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd "Visitor Management Mini System"

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory (or use `.env.example`):

```env
PORT=5000
NODE_ENV=development

# MySQL connection string
DATABASE_URL="mysql://root:@localhost:3306/visitor_management_system"

# JWT configuration
JWT_SECRET="vms_super_secure_jwt_secret_token_key_2026"
JWT_EXPIRES_IN="1d"
```

---

## Database Setup & Seeding

```bash
# 1. Sync Prisma schema with database
npx prisma db push

# 2. Seed default users and demo visitors
npm run prisma:seed
```

### Default Accounts

| Role | Name | Email | Password | Access |
| :--- | :--- | :--- | :--- | :--- |
| **ADMIN** | Rahul Sharma | `admin@vms.com` | `Admin@123` | Full access (CRUD visitors, delete, manage users) |
| **RECEPTIONIST** | Pooja Verma | `receptionist@vms.com` | `Staff@123` | Register visitors, view records, approve/reject |
| **HOST** | Amit Patel | `amit.patel@vms.com` | `Host@123` | View assigned visitors, approve/reject |

---

## Running the Application

```bash
# Development (with hot reload)
npm run start:dev

# Production build
npm run build
npm run start:prod
```

- API Base URL: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/api/docs`

---

## Running Tests

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov
```

---

## API Reference

### 1. Authentication (`/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Authenticate with email & password, returns JWT |
| `POST` | `/auth/register` | Public | Register new staff/user account |
| `GET` | `/auth/me` | Bearer Token | Get current user's profile |

#### Example Login Request:
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@vms.com", "password": "Admin@123"}'
```

---

### 2. Visitor Management (`/visitors`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/visitors` | Authenticated | Register new visitor (defaults to `PENDING`) |
| `GET` | `/visitors` | Authenticated | List visitors (supports search, filter, pagination) |
| `GET` | `/visitors/:id` | Authenticated | Get visitor by ID (includes host & approver details) |
| `PUT` | `/visitors/:id` | Authenticated | Update visitor details |
| `DELETE`| `/visitors/:id` | ADMIN only | Delete visitor record |
| `PATCH`| `/visitors/:id/approve`| Authenticated | Approve or reject visitor |

#### Query Parameters for `GET /visitors`:
- `search`: Search by name, email, phone, company, or badge number
- `status`: Filter by `PENDING`, `APPROVED`, or `REJECTED`
- `hostUserId`: Filter by assigned host user ID
- `startDate` / `endDate`: Filter by check-in date range
- `page` / `limit`: Pagination parameters (default: page 1, limit 10)

#### Example Visitor Approval Request:
```bash
curl -X PATCH http://localhost:5000/visitors/1/approve \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "APPROVED", "badgeNumber": "V-101", "notes": "Checked in at reception desk"}'
```

#### Example Visitor Rejection Request:
```bash
curl -X PATCH http://localhost:5000/visitors/1/approve \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "REJECTED", "rejectionReason": "Government ID verification pending"}'
```

---

### 3. Users & Hosts (`/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/users` | Authenticated | List users (e.g. `?role=HOST` for visitor form dropdowns) |
| `GET` | `/users/:id` | Authenticated | Get user by ID |
| `POST` | `/users` | ADMIN only | Create employee user |
| `PUT` | `/users/:id` | ADMIN only | Update employee user |
| `DELETE`| `/users/:id` | ADMIN only | Delete employee user |

---

## Response Format

All API responses follow a consistent JSON structure:

```json
// Success
{
  "success": true,
  "statusCode": 200,
  "message": "Visitor retrieved successfully",
  "data": { ... }
}

// Error
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["email must be an email"],
  "timestamp": "2026-09-11T09:30:00.000Z",
  "path": "/visitors"
}
```

---

## Documentation & Postman

- **Swagger Documentation:** Available at `http://localhost:5000/api/docs`
- **Postman Collection:** `postman_collection.json` and `postman_environment.json` in the root folder.
- **Architecture Notes:** See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Database ER Diagram:** See [ER_DIAGRAM.md](ER_DIAGRAM.md)
