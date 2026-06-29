# Features

## Core Features

* News scraping from multiple public news websites.
* Automatic news updates every day.
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

```
Final Score = 0.7 × Vector Score + 0.3 × BM25 Score
```

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

```
Scheduler → Run Scraper → Extract New Articles → Generate Embeddings → Save to MongoDB
```

---

### 4. Source Attribution

Every generated answer should include:

* Source Name
* Article Title
* Article URL
* Published Date
* Similarity Score

Example:

```
Sources

1. Reuters
   https://www.reuters.com/...

Published: 2026-06-26
Similarity: 0.94
```

---

### 5. Query Rewriting

Rewrite user queries before retrieval.

Example:

```
Original:   What's new in AI?
Rewritten:  Latest Artificial Intelligence news published recently
```

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

User: `Show Reuters AI news from yesterday`

Extracted Filters:

```json
{
  "source": "Reuters",
  "category": "AI",
  "date": "Yesterday"
}
```

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
