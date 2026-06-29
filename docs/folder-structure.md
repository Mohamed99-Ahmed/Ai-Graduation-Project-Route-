# Folder Structure

```text
news-rag/

├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── graphql/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── backend/
│   ├── src/
│   │   ├── graphql/
│   │   │   ├── schema/
│   │   │   └── resolvers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── ai-service/
│   ├── scraper/
│   │   ├── techcrunch.py
│   │   ├── verge.py
│   │   ├── reuters.py
│   │   └── openai_news.py
│   ├── preprocessing/
│   │   ├── cleaner.py
│   │   └── chunker.py
│   ├── embeddings/
│   │   └── embedding.py
│   ├── retrieval/
│   │   ├── vector_search.py
│   │   ├── bm25.py
│   │   └── hybrid.py
│   ├── llm/
│   │   └── gemini.py
│   ├── pipeline/
│   │   └── rag.py
│   ├── scheduler/
│   │   └── scheduler.py
│   ├── api/
│   │   └── main.py
│   ├── requirements.txt
│   └── .env
│
├── docs/
│
├── .env
│
└── README.md
```
