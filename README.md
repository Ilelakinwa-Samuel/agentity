# Agentity Backend

Agentity is a backend service for registering, verifying, simulating, and executing AI agents.

It integrates:
- **Supabase Postgres** (database)
- **Supabase Auth** (JWT + `httpOnly` cookie)
- **Docker** sandbox simulations
- **Chainlink CRE** workflow (local simulation; webhook execution when deployed)

## Live URLs
- Backend (Render): https://agentity-backend.onrender.com
- Swagger Docs: https://agentity-backend.onrender.com/docs

## Local Setup

### 1) Install
```bash
npm install
````

### 2) Environment Variables (`.env`)

Required:

* `DATABASE_URL`
* `SUPABASE_URL`
* `SUPABASE_SERVICE_ROLE_KEY`
* `SUPABASE_ANON_KEY`

Optional (CRE live execution):

* `CRE_WEBHOOK_URL`
* `CRE_API_KEY`

Example:

```env
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_ANON_KEY=eyJ...

CRE_WEBHOOK_URL=
CRE_API_KEY=
```

### 3) Run

```bash
npm run dev
```

Server runs on:

* [http://localhost:5000](http://localhost:5000)

## API Documentation (Swagger)

Swagger UI:

* Local: [http://localhost:5000/docs](http://localhost:5000/docs)
* Render: [https://agentity-backend.onrender.com/docs](https://agentity-backend.onrender.com/docs)

Swagger supports **Try it out** to execute requests directly.

## Auth Flow (Supabase)

Endpoints:

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/logout`

Auth behavior:

* Returns `jwt` (Supabase `access_token`)
* Sets `agentity_jwt` **httpOnly** cookie (preferred)

Frontend must send cookies:

* `fetch`: `credentials: "include"`
* `axios`: `withCredentials: true`

## Core Backend Routes

### Auth

Endpoints:

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/logout`

Auth returns:

* `jwt` (Supabase access_token)
* Sets `agentity_jwt` httpOnly cookie

All protected endpoints accept either:

* `Authorization: Bearer <jwt>`
* `agentity_jwt` cookie

---

### Agents

Agents are now **owned by the authenticated user**.

Each agent is stored with:

```
creator_id → Supabase user id
```

Endpoints:

* `POST /agents/register` (requires auth)
* `GET /agents/my` (get agents registered by authenticated user)
* `GET /agents/user/:userId` (get agents registered by a specific user)
* `GET /agents/:id`
* `POST /agents/:id/verify`

Agent registration automatically stores:

```
creator_id = req.user.id
```

This allows:

* user-specific dashboards
* ownership tracking
* filtering agents by creator

---

### Simulation

```
POST /simulation/:id
```

Runs a sandbox simulation for the agent and records the result in the audit logs.

---

### Execution

```
POST /execute/:id
```

Execution pipeline:

```
Agent → Sandbox Simulation → CRE Workflow → Execution Result
```

Steps:

1. Agent must be **verified**
2. Sandbox simulation runs
3. CRE workflow evaluates the execution
4. Result is logged to the database
5. Optional blockchain action logging

If CRE webhook is not configured:

```
execution falls back to local execution response
```

---

### Dashboard

```
GET /dashboard/overview
```

Requires authentication.

Dashboard data is **built from the authenticated user inside the JWT**.

The backend extracts the user from:

```
req.user.id
req.user.email
req.user.user_metadata
```

The dashboard aggregates:

* agents created by the user
* agent verification count
* simulation activity
* execution activity
* vulnerability detections
* recent user activity

Example response:

```json
{
  "email": "user@mail.com",
  "name": "John Doe",
  "Totalagent": 3,
  "TotalvarifiedAgent": 2,
  "activeSimulation": 1,
  "VulnerabilitiesDetected": 0,
  "TransactionsExecuted": 4,
  "chart": {
    "labels": ["2026-03-01","2026-03-02"],
    "Verification": [1,1],
    "Vulnerability": [0,0]
  },
  "activeAgent": {},
  "RecentActivity": []
}
```

---

### Health

```
GET /health
```

Returns service status and database connectivity.

Example:

```json
{
  "status": "healthy",
  "database": "connected",
  "uptime": 124.23
}
```

## Chainlink CRE (Local Simulation)

CRE workflow folder:

* `agentity-cre/agent-execution`

Run:

```bash
cd agentity-cre
bun install --cwd ./agent-execution
cre workflow simulate agent-execution
```

Deployment notes:

* CRE workflow deployment is currently **early access**
* When enabled, set `CRE_WEBHOOK_URL` + `CRE_API_KEY` in Render for live execution

## Suggested Test Flow (End-to-End)

1. Open Swagger: `/docs`
2. Register/Login user: `/auth/register` or `/auth/login`
3. Register agent: `/agents/register`
4. Verify agent: `/agents/:id/verify`
5. Simulate agent: `/simulation/:id`
6. Execute agent: `/execute/:id`
7. View dashboard: `/dashboard/overview`

