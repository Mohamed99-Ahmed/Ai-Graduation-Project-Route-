# Lumio — AI News Assistant (RAG)

Graduation project: a RAG-powered news assistant with React frontend, GraphQL backend, and Python AI service.

Full documentation lives in [`docs/`](./docs/README.md).

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [npm](https://www.npmjs.com/) 10+
- MongoDB Atlas cluster (see [database design](./docs/database-design.md))

## Project structure

```text
graduation-project/
├── frontend/     # React + Vite + Tailwind + shadcn/ui
├── backend/      # Express + Apollo GraphQL + Mongoose
├── ai-service/   # FastAPI RAG pipeline (Phase 4+)
└── docs/         # Architecture, phases, specs
```

## Quick start

### 1. Clone and install

```bash
git clone <repo-url>
cd graduation-project

cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Environment variables

Copy the example files and fill in your values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

| Service  | Variable        | Description                          |
| -------- | --------------- | ------------------------------------ |
| Backend  | `MONGODB_URI`   | MongoDB Atlas connection string      |
| Backend  | `PORT`          | HTTP port (default `4000`)           |
| Frontend | `VITE_API_URL`  | Backend GraphQL URL                  |

### 3. Initialize MongoDB indexes

```bash
cd backend
npm run setup:db
```

### 4. Run locally

Open two terminals:

```bash
# Terminal 1 — Backend (GraphQL at http://localhost:4000/graphql)
cd backend
npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend
npm run dev
```

### Verify

- Backend health: `GET http://localhost:4000/health` → `{ "status": "ok", "database": "connected" }`
- GraphQL playground: `http://localhost:4000/graphql`
- Frontend: landing page at `http://localhost:5173`

## Development phases

See [docs/phases.md](./docs/phases.md) for the full roadmap. **Phase 1** (foundation) is complete when both services start and the backend connects to MongoDB Atlas.

## AI service (later phases)

The `ai-service/` folder is a placeholder until Phase 4. See [docs/tech-stack.md](./docs/tech-stack.md).
