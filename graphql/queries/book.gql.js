import { Op, where } from "sequelize";
import { validateQueryParams } from "../../utils/validation.js";
// import { orgFilter } from "../../db/queryFragments/userQF.js";

export const bookQueries = {
  books: async (_, { offset = 0, limit = 10, searchTerm, authorId }, ctx) => {
    // Validate query parameters
    validateQueryParams({ offset, limit, searchTerm, authorId });

    // const where = orgFilter(ctx);
    const where = {};

    if (searchTerm) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${searchTerm}%` } },
        { description: { [Op.iLike]: `%${searchTerm}%` } },
      ];
    }

    if (authorId) {
      // Check if author exists
      const author = await ctx.db.Author.findByPk(authorId);
      if (!author) {
        throw new Error(`Author with ID ${authorId} not found`);
      }
      where.authorId = authorId;
    }

    // Get total count without pagination
    const totalCount = await ctx.db.Book.count({ where });

    // Get paginated books
    const books = await ctx.db.Book.findAll({
      where,
      offset,
      limit,
      include: [
        {
          model: ctx.db.Author,
          as: "author",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return { books, totalCount };
  },

  book: async (_, { id }, ctx) => {
    // Validate query parameters
    validateQueryParams({ id });

    const response = ctx.db.Book.findOne({
      where: {
        id: id,
      },
      include: [{ model: ctx.db.Author, as: "author" }],
    });
    const res = await response;
    return response;
  },

  authors: async (_, __, ctx) => {
    // const where = orgFilter(ctx);
    return ctx.db.Author.findAll({
      // where,
      order: [["createdAt", "DESC"]],
    });
  },

  author: async (_, { id }, ctx) => {
    // Validate query parameters
    validateQueryParams({ id });

    const response = ctx.db.Author.findByPk(id);
    const res = await response;
    return response;
  },
};
