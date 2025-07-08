// server.js
// Main entry point for the Bookstore GraphQL server

import "dotenv/config";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { sequelize, models } from "./db/index.js";
import { typeDefs } from "./graphql/schemas/schema.gql.js";
import { resolvers } from "./graphql/resolvers.js";
import { getAllModelLoaders } from "./db/modelDataLoaders/getAllModelLoaders.js";

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
  });

  await server.start();

  app.use(
    "/api",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const org = { id: req.headers["x-org-id"] || "default-org" };
        const ctx = { req, org };
        ctx.db = models;
        ctx.loaders = getAllModelLoaders(ctx);
        req.headers["content-type"] = "application/json";
        return ctx;
      },
    })
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer();
