import { jest } from '@jest/globals';
import { createBookHandler, createAuthorHandler, addReviewHandler } from '../../../graphql/mutation/book.gql.js';

describe('GraphQL Mutation Handlers', () => {
  let ctx;

  beforeEach(() => {
    ctx = {
      db: {
        Book: { create: jest.fn(), save: jest.fn() },
        Author: { create: jest.fn(), save: jest.fn() },
        BookMetadata: {
          create: jest.fn(),
          findOne: jest.fn(),
          save: jest.fn(),
        },
      },
    };
  });

  describe('createBookHandler', () => {
    it('should create a book and metadata if cover image is provided', async () => {
      const input = { title: 'Test Book', authorId: 'auth-1', cover_image_url: 'img.jpg', published_date: '2024-01-01' };
      ctx.db.Book.create.mockResolvedValue({ id: 'book-1', save: jest.fn() });
      ctx.db.BookMetadata.create.mockResolvedValue({});
      const book = await createBookHandler(ctx, input);
      expect(ctx.db.Book.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test Book' }));
      expect(ctx.db.BookMetadata.create).toHaveBeenCalledWith(expect.objectContaining({ bookId: 'book-1' }));
      expect(book).toBeDefined();
    });
  });

  describe('createAuthorHandler', () => {
    it('should create an author', async () => {
      const input = { name: 'Author', born_date: '1990-01-01' };
      ctx.db.Author.create.mockResolvedValue({ id: 'auth-1', save: jest.fn() });
      const author = await createAuthorHandler(ctx, input);
      expect(ctx.db.Author.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'Author' }));
      expect(author).toBeDefined();
    });
  });

  describe('addReviewHandler', () => {
    it('should add a review to book metadata', async () => {
      const input = { bookId: 'book-1', username: 'user', rating: 5, comment: 'Great!' };
      const metadata = { reviews: [], average_rating: 0, save: jest.fn() };
      ctx.db.BookMetadata.findOne.mockResolvedValue(metadata);
      const result = await addReviewHandler(ctx, input);
      expect(ctx.db.BookMetadata.findOne).toHaveBeenCalledWith({ bookId: 'book-1' });
      expect(metadata.reviews.length).toBe(1);
      expect(result).toBeDefined();
    });
  });
});
