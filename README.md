# Agentity

Agentity is a trust, identity, and execution infrastructure for AI agents interacting with blockchain networks, smart contracts, and decentralized applications.

It provides verification, simulation, and audit capabilities designed to improve the safety, transparency, and reliability of autonomous agent activity.


## Overview

Agentity helps address core trust and security challenges in AI-agent ecosystems by providing:

- **Agent identity and verification**
- **Sandbox-based simulation and testing**
- **Smart contract and platform auditing**
- **Trust and activity anchoring through Hedera**

This repository is organized as a monorepo containing both the frontend application and the backend API.


## Repository Structure

```text
agentity/
├── apps/
│   ├── frontend/
│   └── backend/
├── package.json
├── .gitignore
└── README.md
````


## Applications

### Frontend

User-facing dashboard and application interface.

**Location:** `apps/frontend`

**Stack:**

* React
* Vite
* Tailwind CSS
* Axios
* Firebase
* Zustand
* Chart.js

### Backend

API, workflow orchestration, verification logic, simulation features, and integrations.

**Location:** `apps/backend`

**Stack:**

* Node.js
* Express
* PostgreSQL / Supabase
* Sequelize
* Hedera SDK
* AWS KMS
* Swagger
* Docker-based sandbox tooling


## Architecture

```text
Frontend (React Dashboard)
        │
        ▼
Backend API (Express.js)
• Agent Registration
• Identity Management
• Simulation Tracking
• Reputation Scoring
        │
 ┌──────┴───────────────┐
 ▼                      ▼
Sandbox Layer           Blockchain Layer
(Docker)                (Hedera + related services)

• Agent Simulation      • Verification Logs
• Behavior Testing      • Identity Anchoring
• Risk Detection        • Payment Infrastructure
```


## Hedera Integration

Agentity uses Hedera as part of its trust and verification infrastructure.

Key integration areas include:

* verification event logging
* agent activity history
* trust score anchoring
* mirror node retrieval
* scheduled reverification
* wallet linking and payment support


## Live Links

* **Frontend:** https://hederaagentityfrontend.onrender.com
* **API Docs:** https://hederaagentitybackend.onrender.com/docs


## Getting Started

### Prerequisites

* Node.js 20+
* npm 10+
* Git
* Docker Desktop
* PostgreSQL or Supabase access

### Clone the repository

```bash
git clone https://github.com/Ilelakinwa-Samuel/agentity.git
cd agentity
```

### Install dependencies

```bash
npm install
```


## Environment Setup

### Backend

Create:

```text
apps/backend/.env
```

Example:

```env
PORT=5000

DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_ANON_KEY=

CRE_WEBHOOK_URL=
CRE_API_KEY=

HEDERA_OPERATOR_ID=
HEDERA_OPERATOR_KEY=
HEDERA_NETWORK=testnet

AWS_REGION=
AWS_KMS_KEY_ID=
```

### Frontend

Create:

```text
apps/frontend/.env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```


## Scripts

### Frontend

```bash
npm run dev:frontend
npm run build:frontend
npm run preview:frontend
npm run lint:frontend
```

### Backend

```bash
npm run dev:backend
npm run start:backend
npm run test:backend
npm run smoke:backend
npm run db:check
```


## Local Development

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in a second terminal:

```bash
npm run dev:frontend
```

Default local URLs:

* Frontend: `http://localhost:5173`
* Backend: `http://localhost:5000`
* API Docs: `http://localhost:5000/docs`

---

## Additional Documentation

Backend-specific documentation may be available in:

* `apps/backend/README.md`
* `apps/backend/BACKEND_TESTING.md`
* `apps/backend/FRONTEND_INTEGRATION_CONTRACT.md`
* `apps/backend/HEDERA_SETUP.md`


### Database

* Supabase Postgres


## Contributing

1. Create a branch
2. Make changes in the relevant application
3. Test locally
4. Commit your changes
5. Push your branch
6. Open a pull request