# Financial Monitoring Platform

A personalized stock market dashboard that enables users to follow stocks, build a watchlist, and receive smart in-app alerts — all without requiring registration.

> **Live demo:** [https://financial-monitoring-frontend.onrender.com](https://financial-monitoring-frontend.onrender.com)  
> *(Free-tier hosting — first load after inactivity may take ~30 seconds to wake up)*

---

## Overview

The platform provides a clean single-page dashboard where users can:

- Browse a live **Top Stock Ticker** showing real-time prices and daily changes
- **Search** for any stock by symbol or company name and add it to their personal watchlist
- View their **Watchlist** as a grid of cards, each showing live price data and daily movement
- Open a **Stock Details Modal** with key metrics, analyst recommendations, price targets, and recent news
- Create **price and percentage-change alerts** for any watched stock
- Receive **in-app notifications** when alert conditions are met (checked every minute automatically)
- See a **Watchlist Summary** with biggest gainer, biggest loser, and average daily movement

User identity is managed via an anonymous cookie — no login or email required. The watchlist and alerts persist across visits.

---

## Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | Fast, type-safe UI with modern React |
| UI Library | Chakra UI v3 | Clean, accessible component library |
| Data Fetching | React Query (TanStack Query v5) | Server-state management with caching, loading, and error states |
| HTTP Client | Axios | Consistent API communication with credentials support |
| Backend | Node.js + Express 5 + TypeScript | Lightweight, structured API layer |
| Validation | Zod | Runtime schema validation for all request inputs |
| Database | PostgreSQL | Relational storage for watchlists, alerts, and notifications |
| ORM | Prisma | Type-safe database access with schema-driven migrations |
| Scheduler | node-cron | Runs the alert evaluation job every minute |
| Market Data | Finnhub API | Free-tier stock quotes, company profiles, financials, and news |
| Deployment | Render (Web Service + Static Site + PostgreSQL) | Simple, free-tier deployment for all three parts |

---

## Project Structure

```
Financial Monitoring Platform/
├── frontend/                  # React application (Vite)
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── hooks/             # React Query hooks
│   │   ├── services/          # API call functions
│   │   └── types/             # TypeScript interfaces
│   ├── public/
│   │   └── _redirects         # SPA routing for Render static hosting
│   ├── .env                   # Local env vars (not committed)
│   └── .env.example           # Template for env vars
│
├── backend/                   # Express API server
│   ├── src/
│   │   ├── config/            # env config + Prisma client singleton
│   │   ├── controllers/       # Route handlers
│   │   ├── jobs/              # node-cron alert checker job
│   │   ├── middleware/        # Anonymous user resolver
│   │   ├── repositories/      # Prisma database queries
│   │   ├── routes/            # Express routers
│   │   ├── services/          # Business logic
│   │   ├── types/             # Backend TypeScript types
│   │   ├── validators/        # Zod schemas
│   │   └── utils/             # Shared helpers
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Migration history
│   ├── .env                   # Local env vars (not committed)
│   └── .env.example           # Template for env vars
│
├── docs/                      # Spec and implementation plan
├── render.yaml                # Render deployment config
└── docker-compose.yml         # Local PostgreSQL via Docker
```

---

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local PostgreSQL)
- A free [Finnhub API key](https://finnhub.io)

### 1 — Clone and install

```bash
git clone https://github.com/dorhaboosha/Financial-Monitoring-Platform.git
cd "Financial Monitoring Platform"
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### 2 — Configure environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env and fill in your FINNHUB_API_KEY

# Frontend
cp frontend/.env.example frontend/.env
# VITE_API_URL=http://localhost:5000 is already correct for local dev
```

### 3 — Start the database and run migrations

```bash
npm run db:up          # Starts PostgreSQL in Docker
npm run prisma:generate
npm run prisma:migrate # Applies all migrations
```

### 4 — Start both servers

```bash
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)
- Health check: [http://localhost:5000/health](http://localhost:5000/health)

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/session/init` | Initialize anonymous session (sets cookie) |
| GET | `/api/market/ticker` | Top stock ticker data |
| GET | `/api/market/search-suggestions` | Default search suggestions |
| GET | `/api/market/search?q=` | Search stocks by symbol or name |
| GET | `/api/market/stocks/:symbol` | Stock details (price, company info) |
| GET | `/api/market/stocks/:symbol/insights` | Key metrics, analyst trends, price targets, news |
| GET | `/api/watchlist` | Get current user's watchlist |
| POST | `/api/watchlist` | Add stock to watchlist |
| DELETE | `/api/watchlist/:symbol` | Remove stock from watchlist |
| GET | `/api/alerts` | Get user's active alerts |
| POST | `/api/alerts` | Create a new alert |
| DELETE | `/api/alerts/:alertId` | Delete an alert |
| GET | `/api/notifications` | Get user's notifications |
| PUT | `/api/notifications/read-all` | Mark all notifications as read |
| PUT | `/api/notifications/:notificationId/read` | Mark one notification as read |
| GET | `/api/summary` | Watchlist summary (gainer, loser, avg change) |

---

## Architecture

```
Browser
  │
  ├── React SPA (Vite, Chakra UI, React Query)
  │     └── calls → Express REST API
  │
Express API (Node.js, TypeScript)
  ├── resolves anonymous user from cookie
  ├── calls Finnhub API (server-side only)
  ├── reads/writes PostgreSQL via Prisma
  └── node-cron job (every minute)
        ├── fetches live quotes for active alerts
        ├── evaluates alert conditions
        └── creates Notification records when triggered
```

### Anonymous Identity

No registration is required. On the first visit:
1. The frontend calls `POST /api/session/init`
2. The backend generates a UUID, creates an `AnonymousUser` record, and sets an `httpOnly` cookie
3. Every subsequent request sends the cookie automatically
4. All watchlist data, alerts, and notifications are scoped to that anonymous ID

### Alert Evaluation

The `alertCheckerJob` runs every minute via `node-cron`:
- Loads all active alerts from the database
- Groups them by stock symbol to minimise Finnhub API calls (one quote per symbol)
- Evaluates each alert's condition against the live quote
- Creates a `Notification` record if the condition is met
- Skips creating duplicates if the same alert triggered within the last hour

---

## Data Models

### AnonymousUser
Identifies a user via cookie. Parent of all watchlist, alert, and notification data.

### WatchlistStock
Stores the user's chosen stock symbols. Live price data is fetched from Finnhub at request time — never stored.

### Alert
An alert rule: `{ symbol, type, threshold }`. Supported types:

| Type | Meaning |
|---|---|
| `PRICE_ABOVE` | Trigger when current price > threshold |
| `PRICE_BELOW` | Trigger when current price < threshold |
| `PERCENT_CHANGE_ABOVE` | Trigger when daily % change > threshold |
| `PERCENT_CHANGE_BELOW` | Trigger when daily % change < threshold |

### Notification
A triggered alert event with a human-readable message, read/unread state, and timestamp. Displayed in the notification bell dropdown.

---

## MVP Decisions

**No user registration**  
Anonymous cookie-based sessions keep the UX friction-free while still providing full personalization.

**All Finnhub calls go through the backend**  
The API key is never exposed to the browser. The backend normalises Finnhub responses into consistent shapes before sending them to the frontend.

**Free-tier Finnhub only**  
Historical candle data (`/stock/candle`) requires a paid Finnhub plan and is not used. The modal instead shows Basic Financials, Recommendation Trends, Price Targets, and Company News — all available on the free tier.

**React Query for all server state**  
Every piece of server data (watchlist, alerts, notifications, market data) is managed by React Query. This gives automatic caching, background refetching, loading/error states, and cache invalidation after mutations — without any custom global state.

**Separate deployment services**  
Frontend is deployed as a Render Static Site, backend as a Render Web Service. CORS is configured to allow only the known frontend origin. Cookies use `SameSite=None; Secure` in production to support cross-origin requests.

**Deduplication window for alerts**  
A 1-hour deduplication window prevents the same alert from spamming notifications every minute once a condition is met.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `FINNHUB_API_KEY` | Your Finnhub API key |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `PORT` | Server port (default: `5000`) |
| `NODE_ENV` | `development` or `production` |
| `ANONYMOUS_COOKIE_NAME` | Cookie name for anonymous sessions (default: `anonymous_id`) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:5000`) |
