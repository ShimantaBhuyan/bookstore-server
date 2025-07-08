import { bookQueries } from "./queries/book.gql.js";
import { bookMutations } from "./mutation/book.gql.js";

export const resolvers = {
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
