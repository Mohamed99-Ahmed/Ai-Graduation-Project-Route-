# Project Overview

Build an AI-powered News Assistant using Retrieval-Augmented Generation (RAG) across three layers:

* **Frontend** — React + TypeScript dashboard for chat, news browsing, and source attribution
* **Backend** — Node.js + GraphQL API for auth, user management, and orchestration
* **AI Service** — FastAPI microservice for scraping, embeddings, hybrid search, and Gemini-powered answers

The system collects news from multiple public websites, stores them in MongoDB Atlas with Vector Search, performs Hybrid Search (Vector + BM25), and answers user questions grounded in retrieved articles with full source metadata.
