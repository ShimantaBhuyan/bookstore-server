import {
  validateBookInput,
  validateAuthorInput,
  validateReviewInput,
  validateEditBookInput,
  validateEditAuthorInput,
} from "../../utils/validation.js";

// Handler for creating a book
async function createBookHandler(ctx, input) {
  // Validate input
  validateBookInput(input);

  // Check if author exists
  const author = await ctx.db.Author.findByPk(input.authorId);
  if (!author) {
    throw new Error(`Author with ID ${input.authorId} not found`);
  }

  const book = await ctx.db.Book.create({
    ...input,
    published_date: input.published_date
      ? new Date(input.published_date).toISOString()
      : undefined,
    // orgId: ctx.org.id,
  });

  if (input.cover_image_url) {
    await ctx.db.BookMetadata.create({
      ...input,
      bookId: book.id,
      average_rating: 0,
      reviews: [],
    });
  }

  await book.save();
  return book;
}

// Handler for creating an author
async function createAuthorHandler(ctx, input) {
  // Validate input
  validateAuthorInput(input);

  const author = await ctx.db.Author.create({
    ...input,
    born_date: input.born_date
      ? new Date(input.born_date).toISOString()
      : undefined,
    // orgId: ctx.org.id,
  });
  await author.save();
  return author;
}

// Handler for adding a review
async function addReviewHandler(ctx, input) {
  // Validate input
  validateReviewInput(input);

  // Check if book exists
  const book = await ctx.db.Book.findByPk(input.bookId);
  if (!book) {
    throw new Error(`Book with ID ${input.bookId} not found`);
  }

  let metadata = await ctx.db.BookMetadata.findOne({ bookId: input.bookId });
  if (!metadata) {
    metadata = await ctx.db.BookMetadata.create({
      bookId: input.bookId,
      reviews: [],
      average_rating: 0,
    });
  }

  // Check if user has already reviewed this book
  const existingReview = metadata.reviews.find(
    (review) => review.username === input.username
  );
  if (existingReview) {
    throw new Error(`User ${input.username} has already reviewed this book`);
  }

  metadata.reviews.push({
    username: input.username,
    rating: input.rating,
    comment: input.comment,
    createdAt: new Date(),
  });

  const totalRatings = metadata.reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  metadata.average_rating = totalRatings / metadata.reviews.length;
  await metadata.save();
  return metadata;
}

// Handler for editing a book
async function editBookHandler(ctx, input) {
  // Validate input
  validateEditBookInput(input);

  // Check if book exists
  const book = await ctx.db.Book.findByPk(input.id);
  if (!book) {
    throw new Error(`Book with ID ${input.id} not found`);
  }

  // If authorId is being changed, check if new author exists
  if (input.authorId && input.authorId !== book.authorId) {
    const author = await ctx.db.Author.findByPk(input.authorId);
    if (!author) {
      throw new Error(`Author with ID ${input.authorId} not found`);
    }
  }

  // Update only the fields that are provided
  const updateData = {};
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined)
    updateData.description = input.description;
  if (input.authorId !== undefined) updateData.authorId = input.authorId;

  await book.update(updateData);

  // Update metadata if cover_image_url is provided
  if (input.cover_image_url !== undefined) {
    let metadata = await ctx.db.BookMetadata.findOne({ bookId: input.id });
    if (!metadata) {
      metadata = await ctx.db.BookMetadata.create({
        bookId: input.id,
        reviews: [],
        average_rating: 0,
        cover_image_url: input.cover_image_url,
      });
    } else {
      metadata.cover_image_url = input.cover_image_url;
      await metadata.save();
    }
  }

  return book;
}

// Handler for editing an author
async function editAuthorHandler(ctx, input) {
  // Validate input
  validateEditAuthorInput(input);

  // Check if author exists
  const author = await ctx.db.Author.findByPk(input.id);
  if (!author) {
    throw new Error(`Author with ID ${input.id} not found`);
  }

  // Update only the fields that are provided
  const updateData = {};
  if (input.name !== undefined) updateData.name = input.name;
  if (input.biography !== undefined) updateData.biography = input.biography;
  if (input.born_date !== undefined) {
    updateData.born_date = input.born_date
      ? new Date(input.born_date).toISOString()
      : null;
  }

  await author.update(updateData);
  return author;
}

export const bookMutations = {
  createBook: async (_, { input }, ctx) => createBookHandler(ctx, input),
  createAuthor: async (_, { input }, ctx) => createAuthorHandler(ctx, input),
  addReview: async (_, { input }, ctx) => addReviewHandler(ctx, input),
  editBook: async (_, { input }, ctx) => editBookHandler(ctx, input),
  editAuthor: async (_, { input }, ctx) => editAuthorHandler(ctx, input),
};

export {
  createBookHandler,
  createAuthorHandler,
  addReviewHandler,
  editBookHandler,
  editAuthorHandler,
};
