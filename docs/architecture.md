# Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│   React + TypeScript + Vite + Apollo Client + TanStack Q    │
└──────────────────────────┬──────────────────────────────────┘
                           │ GraphQL
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend                              │
│   Node.js + Express + Apollo Server + Mongoose + JWT        │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / REST
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                       AI Service                            │
│   FastAPI + Gemini + Sentence Transformers + BM25           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
                    MongoDB Atlas
              (Articles + Vector Search)
```

---

## RAG Pipeline (AI Service)

```
News Websites
      ↓
   Scraper (BeautifulSoup + Playwright)
      ↓
   Cleaner + Chunking
      ↓
Embedding Model (Sentence Transformers)
      ↓
MongoDB Atlas Vector Search
      ↓
  Hybrid Search (Vector + BM25)
      ↓
   Gemini API
      ↓
  Grounded Answer → Backend → Frontend
```

---

## Request Flow

```
User Question (Frontend)
      ↓
GraphQL Mutation / Query (Backend)
      ↓
FastAPI RAG Endpoint (AI Service)
      ↓
Retrieve Chunks (Vector + BM25)
      ↓
Generate Answer (Gemini)
      ↓
Return Answer + Sources (Frontend)
```
