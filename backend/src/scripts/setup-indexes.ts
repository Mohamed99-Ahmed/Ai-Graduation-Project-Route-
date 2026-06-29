import mongoose from 'mongoose';

import { connectDatabase, disconnectDatabase } from '../config/database.js';

interface CollectionIndexSpec {
  collection: string;
  key: mongoose.mongo.IndexSpecification;
  options?: mongoose.mongo.CreateIndexesOptions;
}

const collectionIndexSpecs: CollectionIndexSpec[] = [
  {
    collection: 'news_articles',
    key: { url: 1 },
    options: { unique: true, name: 'url_unique' },
  },
  {
    collection: 'news_articles',
    key: { publishedAt: -1 },
    options: { name: 'publishedAt_desc' },
  },
  {
    collection: 'news_articles',
    key: { source: 1, category: 1 },
    options: { name: 'source_category' },
  },
  {
    collection: 'chunks',
    key: { articleId: 1, chunkIndex: 1 },
    options: { name: 'article_chunk' },
  },
  {
    collection: 'users',
    key: { email: 1 },
    options: { unique: true, name: 'email_unique', sparse: true },
  },
  {
    collection: 'chats',
    key: { userId: 1, createdAt: -1 },
    options: { name: 'user_chats' },
  },
  {
    collection: 'messages',
    key: { chatId: 1, createdAt: 1 },
    options: { name: 'chat_messages' },
  },
];

async function ensureIndexes(): Promise<void> {
  const database = mongoose.connection.db;
  if (!database) {
    throw new Error('Database connection is not ready');
  }

  for (const spec of collectionIndexSpecs) {
    const collection = database.collection(spec.collection);
    await collection.createIndex(spec.key, spec.options);
    console.log(`Index ensured on ${spec.collection}: ${spec.options?.name ?? 'default'}`);
  }
}

async function main(): Promise<void> {
  await connectDatabase();
  await ensureIndexes();
  console.log('MongoDB indexes initialized successfully.');
  await disconnectDatabase();
}

main().catch((error: unknown) => {
  console.error('Failed to set up database indexes:', error);
  process.exit(1);
});
