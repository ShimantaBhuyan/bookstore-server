// server.js
// Main entry point for the Bookstore GraphQL server

import "dotenv/config";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { sequelize, models } from "./db/index.js";
import { typeDefs } from "./graphql/schemas/schema.gql.js";
import { bookQueries } from "./graphql/queries/book.gql.js";
import { bookMutations } from "./graphql/mutation/book.gql.js";
import { getAllModelLoaders } from "./db/modelDataLoaders/getAllModelLoaders.js";

// Combine resolvers (expand as needed)
const resolvers = {
  Query: {
    ...bookQueries,
  },
  Book: {
    author: async (book, _, context) => {
      // book.authorId should exist
      return await context.db.Author.findByPk(book.authorId);
    },
    metadata: async (book, _, ctx) => {
      // book.id is the Postgres Book ID
      return await ctx.db.BookMetadata.findOne({ bookId: book.id });
    },
  },
  Author: {
    books: async (author, _, ctx) => {
      return await ctx.db.Book.findAll({
        where: { authorId: author.id },
      });
    },
  },
  Mutation: {
    ...bookMutations,
  },
};

async function startServer() {
  await sequelize.sync({ alter: true });
  const app = express();

  app.use(cors());
  app.use(express.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      //   const org = { id: req.headers["x-org-id"] || "default-org" };
      //   const ctx = { req, org };
      const ctx = { req };
      ctx.db = models; // Attach the models to the context
      ctx.loaders = getAllModelLoaders();
      return ctx;
    },
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
        req.headers["content-type"] = "application/json"; // Ensure content-type is set
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
