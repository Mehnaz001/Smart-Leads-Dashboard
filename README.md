# 🚀 Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack, TypeScript, and TailwindCSS.

## Tech Stack

**Frontend:** React 18, TypeScript, TailwindCSS, Zustand, React Router v6, Axios  
**Backend:** Node.js, Express.js, TypeScript, MongoDB + Mongoose  
**Auth:** JWT + bcrypt  
**DevOps:** Docker + Docker Compose  

## Features

- ✅ JWT Authentication (Register / Login / Protected Routes)
- ✅ Full CRUD for Leads
- ✅ Advanced Filtering: Status, Source, Search (debounced), Sort
- ✅ Backend Pagination (10 per page, skip/limit)
- ✅ Role-Based Access Control (Admin / Sales)
- ✅ CSV Export
- ✅ Dashboard with live stats & progress bars
- ✅ Responsive design with dark theme
- ✅ Docker + Docker Compose setup
- ✅ Full TypeScript (frontend + backend)
- ✅ Loading, empty, and error states
- ✅ Reusable component library

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   └── src/
│       ├── config/        # DB + JWT config
│       ├── controllers/   # authController, leadController
│       ├── middleware/     # auth, validate, errorHandler
│       ├── models/        # User, Lead (Mongoose)
│       ├── routes/        # /auth, /leads
│       ├── types/         # TypeScript interfaces
│       ├── utils/         # jwt helpers, response helpers
│       └── validators/    # express-validator rules
├── frontend/
│   └── src/
│       ├── api/           # axios instance + auth/leads API
│       ├── components/
│       │   ├── ui/        # Button, Input, Select, Modal, Badge, Pagination, ConfirmDialog
│       │   ├── leads/     # LeadTable, LeadForm, LeadFilters, LeadDetailModal
│       │   └── layout/    # Sidebar, AppLayout, ProtectedRoute
│       ├── hooks/         # useLeads, useDebounce
│       ├── pages/         # Login, Register, Dashboard, Leads, NotFound
│       ├── store/         # authStore, leadStore (Zustand)
│       ├── types/         # TypeScript types
│       └── utils/         # constants (colors, status/source arrays)
├── docker-compose.yml
└── README.md
```

## Quick Start

### With Docker (Recommended)

```bash
# Clone the repo
git clone <your-repo-url>
cd smart-leads-dashboard

# Start all services
docker-compose up --build
```

App available at: `http://localhost`  
API available at: `http://localhost:5000`

### Manual Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Documentation

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Auth | Get current user |

### Leads

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/leads` | Auth | List leads (paginated, filterable) |
| POST | `/api/leads` | Auth | Create lead |
| GET | `/api/leads/:id` | Auth | Get single lead |
| PUT | `/api/leads/:id` | Auth | Update lead |
| DELETE | `/api/leads/:id` | Admin | Delete lead |
| GET | `/api/leads/export` | Auth | Export CSV |
| GET | `/api/leads/stats` | Auth | Get stats |

#### Query Parameters for GET /api/leads

| Param | Type | Options |
|-------|------|---------|
| `status` | string | `New`, `Contacted`, `Qualified`, `Lost` |
| `source` | string | `Website`, `Instagram`, `Referral` |
| `search` | string | Searches name and email |
| `sort` | string | `latest` (default), `oldest` |
| `page` | number | Default: 1 |
| `limit` | number | Default: 10, max: 100 |

#### Example Response

```json
{
  "success": true,
  "message": "Leads retrieved successfully",
  "data": [...],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Role-Based Access Control

| Feature | Admin | Sales |
|---------|-------|-------|
| View all leads | ✅ | ❌ (own only) |
| Create leads | ✅ | ✅ |
| Edit leads | ✅ | ✅ (own only) |
| Delete leads | ✅ | ❌ |
| Export CSV | ✅ | ✅ (own only) |
| View stats | ✅ | ✅ (own only) |

## Environment Variables

### Backend `.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartleads
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```
VITE_API_URL=/api
```

## Seed Demo Data

```bash
cd backend
npm run seed
```

Creates:
- **Admin:** admin@demo.com / password123
- **Sales:** sales@demo.com / password123
- **25 sample leads** across all statuses and sources
