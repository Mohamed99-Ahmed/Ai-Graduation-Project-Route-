import http from 'node:http';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import express from 'express';

import { connectDatabase, databaseConnectionState } from './config/database.js';
import { env } from './config/env.js';
import { resolvers } from './graphql/resolvers/index.js';
import { typeDefs } from './graphql/schema/index.js';

async function startServer(): Promise<void> {
  await connectDatabase();

  const app = express();
  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  app.get('/health', (_request, response) => {
    response.json({
      status: 'ok',
      database: databaseConnectionState(),
    });
  });

  app.use(
    '/graphql',
    cors({ origin: env.corsOrigin, credentials: true }),
    express.json(),
    expressMiddleware(apolloServer),
  );

  await new Promise<void>((resolve) => {
    httpServer.listen(env.port, resolve);
  });

  console.log(`Backend ready at http://localhost:${env.port}`);
  console.log(`GraphQL endpoint: http://localhost:${env.port}/graphql`);
}

startServer().catch((error: unknown) => {
  console.error('Failed to start backend:', error);
  process.exit(1);
});
