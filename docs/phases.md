# Project Phases

High-level implementation roadmap for the AI News Assistant (RAG) graduation project. Each phase builds on the previous one and maps directly to the [deliverables](./deliverables.md), [architecture](./architecture.md), and [features](./features.md).

**Strategy:** Build the full **Frontend + Backend** application first (auth, UI, GraphQL, news browsing). Add the **AI Service** (scraping, RAG, advanced retrieval) in the later phases, then wire everything together.

---

## Phase Overview

| Phase | Name | Focus | Depends On |
| ----- | ---- | ----- | ---------- |
| 1 | Foundation & Infrastructure | Repo setup, MongoDB Atlas, environment config | — |
| 2 | Backend API | GraphQL, auth, user/chat/news APIs | Phase 1 |
| 3 | Frontend Application | Dashboard, chat UI, news browse, source panel | Phase 2 |
| 4 | Data Pipeline | Scraping, cleaning, chunking, storage | Phase 1 |
| 5 | RAG Core | Embeddings, vector search, Gemini answers | Phase 4 |
| 6 | Advanced AI Features | Hybrid search, query intelligence, scheduling | Phase 5 |
| 7 | Integration & Quality | Connect AI to backend/frontend, testing, polish | Phase 3, 6 |
| 8 | Final Delivery | Documentation, report, demo | Phase 7 |

---

## Phase 1 — Foundation & Infrastructure

**Goal:** Establish the monorepo structure, shared configuration, and MongoDB Atlas so frontend and backend can be built and run locally.

### Tasks

- Initialize project folders: `frontend/`, `backend/`, `ai-service/` (skeleton only), `docs/`
- Create MongoDB Atlas cluster (Vector Search index can be added later in Phase 5)
- Define collections and indexes per [database design](./database-design.md):
  - `news_articles`
  - `chunks` (schema ready; vector index in Phase 5)
  - `users`, `chats`, `messages`
- Set up environment variables (`.env` per service)
- Configure Git repository, `.gitignore`, and basic README
- Bootstrap backend: Node.js + Express + Apollo Server (empty schema)
- Bootstrap frontend: React + TypeScript + Vite + Tailwind + shadcn/ui
- Document local development setup (how to run frontend + backend)

### Deliverables

- Working MongoDB Atlas connection from frontend and backend
- Project skeleton matching [folder structure](./folder-structure.md)
- Environment variable template (`.env.example`)
- Both frontend and backend start locally without errors

### Success Criteria

- Backend connects to MongoDB Atlas
- Frontend dev server runs and renders a basic page
- Developer can clone the repo and start frontend + backend independently
- `ai-service/` folder exists as a placeholder for later phases

---

## Phase 2 — Backend API

**Goal:** Create the full GraphQL API for authentication, user management, chat, and news — with a **stub RAG endpoint** until the AI service is ready in Phase 5.

### Tasks

- Set up Node.js + Express + Apollo Server
- Define GraphQL schema:
  - Auth: register, login, Google OAuth, refresh token
  - User: profile, preferences
  - Chat: create chat, send message, list history
  - News: list articles, filter by source/category/date
  - RAG: `askQuestion` mutation (returns mock/stub response for now)
- Implement Mongoose models: `users`, `chats`, `messages`, `news_articles`
- JWT authentication middleware
- Google OAuth via Passport
- Seed `news_articles` with sample/mock data for frontend development
- Error handling, logging (Winston), security headers (Helmet)
- Input validation on all mutations
- Stub AI service client that returns placeholder answers + fake sources

### Deliverables

- `backend/src/graphql/` — schema and resolvers
- `backend/src/models/` — Mongoose models
- `backend/src/services/` — auth service, stub AI client
- Working GraphQL playground / Apollo Sandbox

### Success Criteria

- User can register, log in, and authenticate via JWT
- Google OAuth sign-in works
- Chat history persists per authenticated user
- News list query returns articles with filters (source, category, date)
- `askQuestion` returns a stub answer with mock sources (until Phase 7)
- Frontend can consume all required GraphQL operations

---

## Phase 3 — Frontend Application

**Goal:** Build the complete React dashboard — auth, chat UI, news browse, and source attribution — fully connected to the backend.

### Tasks

- Configure Apollo Client for GraphQL
- Configure TanStack Query for supplementary server state
- Build core pages:
  - Landing / auth (login, register, Google OAuth)
  - Chat dashboard (message input, loading states)
  - News browse (article list with filters)
  - Source panel (cited sources with links, dates, scores)
- Build reusable components:
  - Chat message bubble (user + assistant)
  - Source citation card
  - Article card
  - Filter bar (source, category, date)
  - Loading skeletons and error states
- Form handling with React Hook Form + Zod
- Toast notifications (Sonner)
- Responsive layout and basic animations (Framer Motion)
- Render assistant answers as Markdown (React Markdown)
- Connect all pages to live backend GraphQL API

### Deliverables

- Full React frontend per [tech stack](./tech-stack.md)
- Auth flow connected to backend
- Working chat interface (stub answers from backend for now)
- News browse page with real data from MongoDB

### Success Criteria

- Authenticated user can sign up, log in, and log out
- Chat UI sends messages and displays stub assistant responses with sources
- News browse page lists articles with working filters
- UI is responsive on desktop and mobile
- Error and loading states handled gracefully
- **Full app works end-to-end without the AI service**

---

## Phase 4 — Data Pipeline

**Goal:** Collect news from public websites, normalize the content, and persist articles in MongoDB. Replace mock news data with real scraped articles.

### Tasks

- Set up FastAPI project in `ai-service/`
- Implement scrapers for target [news sources](./dataset.md):
  - Technology: TechCrunch, The Verge, TNW, VentureBeat
  - AI: OpenAI, Hugging Face, DeepMind, Anthropic
  - General: Reuters, AP News
  - Science: ScienceDaily, Phys.org
- Build preprocessing pipeline:
  - HTML cleaning (BeautifulSoup)
  - Dynamic page support where needed (Playwright)
  - Semantic chunking with metadata preservation
- Save articles to `news_articles` collection
- Save chunks to `chunks` collection (without embeddings yet)
- Add deduplication by URL to avoid duplicate articles
- Expose endpoint or CLI to run scraping on demand
- Sync scraped articles so backend news queries return real data

### Deliverables

- `ai-service/scraper/` — one module per news source
- `ai-service/preprocessing/` — cleaner and chunker
- `ai-service/api/main.py` — FastAPI entry point (ingest endpoints)
- Populated MongoDB with real article data

### Success Criteria

- At least 8 news sources scraped successfully
- Articles stored with title, content, source, URL, category, published date
- Chunks linked to parent articles via `articleId`
- Pipeline can be re-run without creating duplicates
- Frontend news browse shows real scraped articles

---

## Phase 5 — RAG Core

**Goal:** Build the retrieval and generation pipeline so the AI service can answer questions grounded in stored news. Replace the backend stub with a real AI client.

### Tasks

- Create MongoDB Atlas Vector Search index on `chunks`
- Generate embeddings for all chunks (Sentence Transformers)
- Store embeddings in MongoDB Atlas Vector Search
- Implement vector similarity search
- Integrate Gemini API for answer generation
- Design and implement the RAG pipeline per [prompt design](./prompt-design.md):
  - Retrieve top-k relevant chunks
  - Build context prompt with chunk text and metadata
  - Generate grounded answer
  - Return answer with source metadata
- Expose FastAPI endpoints:
  - `POST /rag/query` — ask a question, get answer + sources
  - `POST /rag/ingest` — trigger scrape + embed pipeline
- Implement basic source attribution (source name, title, URL, date, score)
- Update backend AI service client to call real FastAPI endpoints (ready for Phase 7)

### Deliverables

- `ai-service/embeddings/` — embedding generation
- `ai-service/retrieval/` — vector search
- `ai-service/llm/` — Gemini integration
- `ai-service/pipeline/rag.py` — end-to-end RAG flow
- Backend AI client updated (not yet switched on in production flow)

### Success Criteria

- RAG endpoint returns coherent, grounded answers via direct API test
- Every answer includes at least one cited source with URL
- Retrieval returns relevant chunks for [example questions](./example-questions.md)
- RAG endpoint responds within acceptable latency (< 10s)

---

## Phase 6 — Advanced AI Features

**Goal:** Enhance retrieval quality and query intelligence beyond basic RAG.

### Tasks

- **Hybrid Search** — combine Vector Search + BM25 with RRF or weighted fusion
- **Metadata Filtering** — filter by date, source, category, language, author before retrieval
- **Query Rewriting** — rewrite vague queries before search (via Gemini)
- **Query Classification** — classify intent (latest news, summary, comparison, out of scope, etc.)
- **Structured Filter Extraction** — parse filters from natural language ("Reuters AI news from yesterday")
- **Scheduled Updates** — APScheduler to scrape and embed new articles daily
- **Similarity Score Display** — expose chunk scores in API response
- Handle out-of-scope queries gracefully (no hallucination)

### Deliverables

- `ai-service/retrieval/bm25.py` and `hybrid.py`
- Query preprocessing module (rewrite, classify, extract filters)
- `ai-service/scheduler/scheduler.py` — automated daily updates
- Updated RAG pipeline integrating all advanced steps

### Success Criteria

- Hybrid search outperforms vector-only on keyword-heavy queries
- Metadata filters correctly narrow results (e.g., "Reuters AI news today")
- Scheduler runs daily without manual intervention
- Out-of-scope questions return a clear "I don't have information" response
- [Advanced features](./features.md) 1–8 are functional

---

## Phase 7 — Integration & Quality

**Goal:** Connect the AI service to the backend and frontend, replace all stubs, and polish the full system.

### Tasks

- Switch backend from stub AI client to real FastAPI RAG endpoints
- End-to-end integration testing:
  - Scrape → embed → store → query → answer → display in chat UI
  - Auth → chat → history → logout
- Connect frontend filters to backend/AI metadata filtering
- Performance checks (embedding batch size, retrieval latency, API timeouts)
- Security review (JWT expiry, CORS, env secrets, input sanitization)
- UI polish: empty states, edge cases, accessibility basics
- Fix bugs found during manual testing with [example questions](./example-questions.md)
- Optional: rate limiting, basic logging/monitoring

### Deliverables

- Fully integrated system running locally (all three services)
- No stub/mock responses remaining
- Bug fixes and UX improvements
- Test checklist documented

### Success Criteria

- Complete user journey works: sign up → ask question → see real AI answer + sources → browse news
- No critical bugs in core flows
- System handles empty database, network errors, and invalid input
- All [deliverables](./deliverables.md) items are implemented

---

## Phase 8 — Final Delivery

**Goal:** Package the project for submission: documentation, repository, demo, and final report.

### Tasks

- Finalize all documentation in `docs/`
- Write final graduation report covering:
  - Problem statement and objectives
  - System architecture and design decisions
  - RAG pipeline explanation (with diagrams)
  - Implementation details per phase
  - Evaluation (sample Q&A, retrieval quality observations)
  - Challenges and lessons learned
  - Future work (see [future improvements](./future-improvements.md))
- Prepare demo script and sample questions for presentation
- Clean up GitHub repository (README, setup instructions, screenshots)
- Record demo video or prepare live demo (if required)
- Tag release version (e.g., `v1.0.0`)

### Deliverables

- Complete GitHub repository
- Final report (PDF)
- Demo-ready application
- Updated [documentation index](./README.md)

### Success Criteria

- Repository is cloneable and runnable by a reviewer
- Report explains architecture, RAG approach, and results clearly
- Demo showcases core and advanced features confidently
- All graduation requirements met

---

## Suggested Timeline

Approximate schedule for a typical graduation project (~3–4 months):

| Phase | Duration | Cumulative |
| ----- | -------- | ---------- |
| Phase 1 — Foundation | 1 week | Week 1 |
| Phase 2 — Backend API | 2 weeks | Weeks 2–3 |
| Phase 3 — Frontend | 3 weeks | Weeks 4–6 |
| Phase 4 — Data Pipeline | 2 weeks | Weeks 7–8 |
| Phase 5 — RAG Core | 2 weeks | Weeks 9–10 |
| Phase 6 — Advanced AI | 2 weeks | Weeks 11–12 |
| Phase 7 — Integration | 1 week | Week 13 |
| Phase 8 — Final Delivery | 1 week | Week 14 |

> Phases 2 and 3 are the main app-building block. Phases 4–6 are the AI block and can start once Phase 1 is done (Phase 4 runs in parallel with frontend polish if needed).

---

## Phase Dependencies (Visual)

```
Phase 1 (Foundation)
    ├── Phase 2 (Backend API)
    │       └── Phase 3 (Frontend) ──────────────────────┐
    │                                                     │
    └── Phase 4 (Data Pipeline)                          │
            └── Phase 5 (RAG Core)                       │
                    └── Phase 6 (Advanced AI)              │
                            └── Phase 7 (Integration) ←──┘
                                    └── Phase 8 (Final Delivery)
```

**Two tracks after Phase 1:**
- **App track:** Backend → Frontend (usable app with stub AI)
- **AI track:** Data Pipeline → RAG Core → Advanced AI
- **Merge at Phase 7:** Connect real AI to the live app

---

## Current Status

| Phase | Status |
| ----- | ------ |
| Phase 1 — Foundation & Infrastructure | Complete |
| Phase 2 — Backend API | Not started |
| Phase 3 — Frontend Application | Not started |
| Phase 4 — Data Pipeline | Not started |
| Phase 5 — RAG Core | Not started |
| Phase 6 — Advanced AI Features | Not started |
| Phase 7 — Integration & Quality | Not started |
| Phase 8 — Final Delivery | Not started |

Update this table as you complete each phase.
