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
