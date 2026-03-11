# Agentity Backend

Agentity is a backend service for registering, verifying, simulating, auditing, and executing AI agents.

It integrates:
- **Supabase Postgres** (database)
- **Supabase Auth** (JWT + `httpOnly` cookie)
- **Docker** sandbox simulations
- **Chainlink CRE** workflow (local simulation; webhook execution when deployed)
- **Avalanche Fuji** smart contract logging for on-chain execution traceability

## Live URLs

- Backend (Render): https://agentity-backend.onrender.com
- Swagger Docs: https://agentity-backend.onrender.com/docs

## Local Setup

### 1) Install

```bash
npm install

2) Environment Variables (.env)

Required:

DATABASE_URL

SUPABASE_URL

SUPABASE_SERVICE_ROLE_KEY

SUPABASE_ANON_KEY

Optional (CRE live execution):

CRE_WEBHOOK_URL

CRE_API_KEY

Optional (Avalanche / blockchain logging):

AVALANCHE_RPC_URL

AVALANCHE_FUJI_REGISTRY_ADDRESS

OPERATOR_PRIVATE_KEY

SNOWTRACE_API_KEY

Example:

DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SUPABASE_ANON_KEY=eyJ...

CRE_WEBHOOK_URL=
CRE_API_KEY=

AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_FUJI_REGISTRY_ADDRESS=0x...
OPERATOR_PRIVATE_KEY=
SNOWTRACE_API_KEY=
3) Run
npm run dev

Server runs on:

http://localhost:5000

API Documentation (Swagger)

Swagger UI:

Local: http://localhost:5000/docs

Render: https://agentity-backend.onrender.com/docs

Swagger supports Try it out to execute requests directly.

Auth Flow (Supabase)

Endpoints:

POST /auth/register

POST /auth/login

POST /auth/logout

Auth behavior:

Returns jwt (Supabase access_token)

Sets agentity_jwt httpOnly cookie (preferred)

Frontend must send cookies:

fetch: credentials: "include"

axios: withCredentials: true

All protected endpoints accept either:

Authorization: Bearer <jwt>

agentity_jwt cookie

Core Backend Routes
Auth

Endpoints:

POST /auth/register

POST /auth/login

POST /auth/logout

Auth returns:

jwt (Supabase access token)

Sets agentity_jwt httpOnly cookie

Protected routes can be accessed with either:

Authorization: Bearer <jwt>

agentity_jwt cookie

Agents

Agents are now owned by the authenticated user.

Each agent is stored with:

creator_id → Supabase user id

Endpoints:

POST /agents/register (requires auth)

GET /agents/my (get agents registered by authenticated user)

GET /agents/user/:userId (get agents registered by a specific user)

GET /agents/:id

POST /agents/:id/verify

Agent registration automatically stores:

creator_id = req.user.id

This allows:

user-specific dashboards

ownership tracking

filtering agents by creator

Agent registration also creates:

agent metadata

reputation record

behavior registration log

user activity log

Registration is wrapped in a database transaction so failed writes roll back cleanly.

Simulation

This module powers the frontend Simulation Sandbox screen.

Endpoints:

GET /simulation/scenarios

POST /simulation/run

GET /simulation/history

POST /simulation/:id (legacy / backward-compatible route)

Simulation flow:

User selects one of their registered agents

User selects a scenario type

Backend runs sandbox simulation

Result is stored in simulation_runs

Simulation history becomes available for the user

User activity is logged

Example simulation response:

{
  "id": "simulation-run-uuid",
  "agentId": "agent-uuid",
  "agentName": "My Trading Agent",
  "scenario": "Token Swap",
  "riskScore": 36,
  "vulnerabilities": 1,
  "status": "completed",
  "createdAt": "2026-03-11T12:00:00.000Z",
  "result": {
    "summary": "Simulation completed successfully"
  }
}
Smart Contract Audits

This module powers the frontend Smart Contract Audits screen.

Endpoints:

POST /audits

GET /audits/history

GET /audits/:id

Supported source types:

paste

github

Audit flow:

User submits contract name and source

Backend runs audit analysis

Result is stored in smart_contract_audits

Audit history becomes available for the user

Full audit detail can be fetched by audit id

Example audit response:

{
  "id": "audit-uuid",
  "contractName": "LiquidityPool",
  "riskLevel": "medium",
  "consensusScore": 72,
  "status": "completed",
  "createdAt": "2026-03-11T12:00:00.000Z",
  "findings": [],
  "summary": "LiquidityPool completed audit with 2 finding(s). Overall risk is medium."
}
Execution
POST /execute/:id

Execution pipeline:

Agent → Sandbox Simulation → CRE Workflow → Execution Result

Steps:

Agent must be verified

Sandbox simulation runs

CRE workflow evaluates execution

Result is logged to the database

Optional blockchain action logging runs if blockchain_agent_id exists

If CRE webhook is not configured:

execution falls back to local execution response

Example execution response:

{
  "simulation": {},
  "execution": {},
  "blockchain": {
    "success": true,
    "txHash": "0x..."
  }
}
Dashboard
GET /dashboard/overview

Requires authentication.

Dashboard data is built from the authenticated user inside the JWT.

The backend extracts the user from:

req.user.id
req.user.email
req.user.user_metadata

The dashboard aggregates:

agents created by the user

verified agents created by the user

simulation activity

execution activity

vulnerability detections

recent user activity

active agent

chart data

Example response:

{
  "email": "user@mail.com",
  "name": "John Doe",
  "Totalagent": 3,
  "TotalvarifiedAgent": 2,
  "activeSimulation": 1,
  "VulnerabilitiesDetected": 0,
  "TransactionsExecuted": 4,
  "chart": {
    "labels": ["2026-03-01", "2026-03-02"],
    "Verification": [1, 1],
    "Vulnerability": [0, 0]
  },
  "activeAgent": {},
  "RecentActivity": []
}
Health
GET /health

Returns service status and database connectivity.

Example:

{
  "status": "healthy",
  "database": "connected",
  "uptime": 124.23
}
Chainlink CRE (Local Simulation)

CRE workflow folder:

agentity-cre/agent-execution

Run:

cd agentity-cre
bun install --cwd ./agent-execution
cre workflow simulate agent-execution --target staging-settings

Deployment notes:

CRE workflow deployment is currently early access

When enabled, set CRE_WEBHOOK_URL + CRE_API_KEY in Render for live execution

Current CRE workflow status:

workflow compiles successfully

workflow simulation runs successfully

Avalanche Fuji contract address is injected into workflow config

live CRE deployment is pending access approval

Avalanche Smart Contract

Deployed contract:

ERC8004AgentRegistry

Used for:

agent registry tracking

action logging on-chain

execution traceability

Available test scripts:

scripts/read-latest-agent.js

scripts/register-test-agent.js

scripts/log-test-action.js

Example usage:

npx hardhat run scripts/read-latest-agent.js --network fuji
npx hardhat run scripts/register-test-agent.js --network fuji
npx hardhat run scripts/log-test-action.js --network fuji
Suggested Test Flow (End-to-End)

Open Swagger: /docs

Register/Login user: /auth/register or /auth/login

Register agent: /agents/register

Verify agent: /agents/:id/verify

Fetch user agents: /agents/my

Load simulation scenarios: /simulation/scenarios

Run simulation: /simulation/run

View simulation history: /simulation/history

Create smart contract audit: /audits

View audit history: /audits/history

View audit detail: /audits/:id

Execute verified agent: /execute/:id

View dashboard: /dashboard/overview

Run CRE simulation from agentity-cre

Optionally test Avalanche smart contract scripts

Database Notes

Main tables currently used include:

Agents

AgentMetadata

AgentReputations

AgentBehaviorLogs

user_agent_events

simulation_runs

smart_contract_audits

Current Backend Scope

The backend now supports:

user authentication

user-owned agents

simulation workflows

smart contract audit workflows

execution workflows

dashboard aggregation

blockchain logging

CRE simulation support