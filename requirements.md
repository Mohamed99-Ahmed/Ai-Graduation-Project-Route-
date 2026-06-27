# AI News Assistant (RAG) - Project Plan

## Project Overview

Build an AI-powered News Assistant using Retrieval-Augmented Generation (RAG) that collects news articles from multiple public news websites, stores them in MongoDB Atlas, performs Vector Search + Hybrid Search (BM25), and answers user questions using the Gemini API.

The assistant should answer only from the retrieved news articles while displaying the article sources and metadata.

---

# Features

## Core Features

* News scraping from multiple public news websites.
* Automatic news updates every hour or every day.
* Store all news articles in MongoDB Atlas.
* Split articles into semantic chunks.
* Generate embeddings for every chunk.
* Store embeddings using MongoDB Atlas Vector Search.
* Retrieve the most relevant chunks.
* Generate grounded answers using Gemini API.

---

## Advanced Features

### 1. Hybrid Search

Implement Hybrid Search by combining:

* Vector Search (Semantic Search)
* BM25 (Keyword Search)

Combine both scores using:

* Reciprocal Rank Fusion (RRF)

or

* Weighted Score Fusion

Example:

Final Score =
0.7 × Vector Score +
0.3 × BM25 Score

---

### 2. Metadata Filtering

Allow filtering by:

* Date
* Source
* Category
* Language
* Author

Example Questions:

* AI news from Reuters
* Technology news published today
* Science news from last week
* Articles from TechCrunch
* English AI news

---

### 3. Automatic News Updates

Implement scheduled scraping.

Possible schedules:

* Every hour
* Every 6 hours
* Every day

Suggested Libraries:

* APScheduler
* schedule
* Cron Job

Flow:

Scheduler
↓

Run Scraper
↓

Extract New Articles
↓

Generate Embeddings

↓

Save to MongoDB

---

### 4. Source Attribution

Every generated answer should include:

* Source Name
* Article Title
* Article URL
* Published Date
* Similarity Score

Example:

Sources

1. Reuters
   https://www.reuters.com/...

Published:
2026-06-26

Similarity:
0.94

---

### 5. Query Rewriting

Rewrite user queries before retrieval.

Example:

Original:

What's new in AI?

↓

Rewritten:

Latest Artificial Intelligence news published recently

---

### 6. Query Classification

Possible classes:

* Latest News
* Summary
* Comparison
* Date Query
* Category Query
* Source Query
* General Question
* Out of Scope

---

### 7. Structured Filter Extraction

Extract filters from user questions.

Example:

User:

Show Reuters AI news from yesterday

Extracted Filters

{
"source": "Reuters",
"category": "AI",
"date": "Yesterday"
}

---

### 8. Similarity Score Display

Display:

* Chunk
* Similarity Score
* Metadata

before generating the final answer.

---

### 9. Chat History

(Optional)

Store previous conversations inside MongoDB.

Collections:

* users
* chats
* messages

---

# Dataset

## News Websites

Technology

* https://techcrunch.com
* https://www.theverge.com
* https://thenextweb.com
* https://venturebeat.com

AI

* https://openai.com/news
* https://huggingface.co/blog
* https://deepmind.google/discover/blog
* https://www.anthropic.com/news

General News

* https://www.reuters.com
* https://apnews.com

Science

* https://www.sciencedaily.com
* https://phys.org

---

# Project Architecture

News Websites

↓

Scraper

↓

Cleaner

↓

Chunking

↓

Embedding Model

↓

MongoDB Atlas Vector Search

↓

Hybrid Search

(Vector + BM25)

↓

Gemini API

↓

Final Answer

---

# Database Design

## Collection: news_articles

```json
{
    "_id": "",
    "title": "",
    "content": "",
    "summary": "",
    "category": "",
    "author": "",
    "publishedAt": "",
    "source": "",
    "url": "",
    "language": ""
}
```

---

## Collection: chunks

```json
{
    "_id": "",
    "articleId": "",
    "chunkIndex": 0,
    "text": "",
    "embedding": [],
    "metadata": {
        "category": "",
        "source": "",
        "publishedAt": "",
        "language": ""
    }
}
```

---

## Collection: chat_history (Optional)

```json
{
    "_id": "",
    "userId": "",
    "messages": []
}
```

---

# Folder Structure

```text
news-rag/

│

├── scraper/
│   ├── techcrunch.py
│   ├── verge.py
│   ├── reuters.py
│   ├── openai_news.py
│
├── preprocessing/
│   ├── cleaner.py
│   ├── chunker.py
│
├── embeddings/
│   ├── embedding.py
│
├── database/
│   ├── mongo.py
│
├── retrieval/
│   ├── vector_search.py
│   ├── bm25.py
│   ├── hybrid.py
│
├── scheduler/
│   ├── scheduler.py
│
├── llm/
│   ├── gemini.py
│
├── pipeline/
│   ├── rag.py
│
├── streamlit_app.py
│
├── requirements.txt
│
├── .env
│
└── README.md
```

---

# Libraries

## Web Scraping

* requests
* beautifulsoup4
* lxml
* playwright (if needed)

---

## Database

* pymongo

---

## AI

* google-generativeai
* sentence-transformers (or Gemini Embeddings)

---

## Hybrid Search

* rank-bm25

---

## Scheduler

* APScheduler

or

* schedule

---

## Data Processing

* pandas
* numpy

---

## Environment Variables

* python-dotenv

---

## GUI

* streamlit

---

# User Example Questions

* What happened in AI today?
* Summarize this week's technology news.
* Show Reuters articles about Bitcoin.
* Compare OpenAI and Google announcements.
* Latest NVIDIA news.
* Technology news from yesterday.
* AI news published by TechCrunch.
* Science news from last month.
* What are today's biggest headlines?
* Give me articles about robotics.

---

# Future Improvements

* Authentication
* User Accounts
* Chat History
* Favorite Articles
* News Recommendation System
* Multi-language Support
* Voice Input
* Voice Output
* Sentiment Analysis
* Article Summarization
* Topic Clustering
* Trending Topics Dashboard
* Admin Dashboard
* Docker Deployment
* Kubernetes Deployment
* CI/CD Pipeline
* REST API
* FastAPI Backend
* React Frontend
* Mobile Application
* Cached Retrieval
* Redis Integration
* Elasticsearch Integration
* Evaluation Metrics (Precision@K, Recall@K, MRR)
* Monitoring & Logging
* Rate Limiting
* Feedback System
* Dark Mode UI

---

# Tech Stack

| Layer           | Technology                                |
| --------------- | ----------------------------------------- |
| Language        | Python                                    |
| Database        | MongoDB Atlas                             |
| Vector Store    | MongoDB Atlas Vector Search               |
| LLM             | Gemini API                                |
| Embeddings      | Gemini Embeddings / Sentence Transformers |
| Keyword Search  | BM25                                      |
| Hybrid Search   | Vector Search + BM25                      |
| Web Scraping    | Requests + BeautifulSoup + Playwright     |
| Scheduler       | APScheduler                               |
| GUI             | Streamlit                                 |
| Environment     | python-dotenv                             |
| Data Processing | Pandas + NumPy                            |

---

# Deliverables

* End-to-End RAG Pipeline
* MongoDB Atlas Vector Search
* Hybrid Search (Vector + BM25)
* Automatic News Scraper
* Scheduled News Updates
* Query Rewriting
* Query Classification
* Structured Filter Extraction
* Metadata Filtering
* Source Attribution
* Streamlit Dashboard
* Complete Documentation
* GitHub Repository
* Final Report


### prompt design 

You are an AI News Assistant.

Your task is to answer ONLY using the provided context.

If the answer is not available in the context, say:

"I couldn't find the answer in the retrieved articles."

Do not use your own knowledge.

Context:

{Retrieved Chunks}

Question:

{User Question}

Only answer using the context.