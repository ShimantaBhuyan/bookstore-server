// Handler for creating a book
async function createBookHandler(ctx, input) {
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
  let metadata = await ctx.db.BookMetadata.findOne({ bookId: input.bookId });
  if (!metadata) {
    metadata = await ctx.db.BookMetadata.create({
      bookId: input.bookId,
      reviews: [],
      average_rating: 0,
    });
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

export const bookMutations = {
  createBook: async (_, { input }, ctx) => createBookHandler(ctx, input),
  createAuthor: async (_, { input }, ctx) => createAuthorHandler(ctx, input),
  addReview: async (_, { input }, ctx) => addReviewHandler(ctx, input),
};
