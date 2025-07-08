import { jest } from "@jest/globals";
import {
  createBookHandler,
  createAuthorHandler,
  addReviewHandler,
} from "../../../graphql/mutation/book.gql.js";

describe("GraphQL Mutation Handlers", () => {
  let ctx;

  beforeEach(() => {
    ctx = {
      db: {
        Book: { create: jest.fn(), save: jest.fn(), findByPk: jest.fn() },
        Author: { create: jest.fn(), save: jest.fn(), findByPk: jest.fn() },
        BookMetadata: {
          create: jest.fn(),
          findOne: jest.fn(),
          save: jest.fn(),
        },
      },
    };
  });

  describe("createBookHandler", () => {
    it("should create a book and metadata if cover image is provided", async () => {
      const input = {
        title: "Test Book",
        authorId: "550e8400-e29b-41d4-a716-446655440000",
        cover_image_url: "https://example.com/img.jpg",
        published_date: "2024-01-01",
      };

      // Mock author exists
      ctx.db.Author.findByPk.mockResolvedValue({
        id: "550e8400-e29b-41d4-a716-446655440000",
      });
      ctx.db.Book.create.mockResolvedValue({
        id: "550e8400-e29b-41d4-a716-446655440001",
        save: jest.fn(),
      });
      ctx.db.BookMetadata.create.mockResolvedValue({});

      const book = await createBookHandler(ctx, input);

      expect(ctx.db.Author.findByPk).toHaveBeenCalledWith(
        "550e8400-e29b-41d4-a716-446655440000"
      );
      expect(ctx.db.Book.create).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Test Book" })
      );
      expect(ctx.db.BookMetadata.create).toHaveBeenCalledWith(
        expect.objectContaining({
          bookId: "550e8400-e29b-41d4-a716-446655440001",
        })
      );
      expect(book).toBeDefined();
    });

    it("should throw error if author does not exist", async () => {
      const input = {
        title: "Test Book",
        authorId: "550e8400-e29b-41d4-a716-446655440000",
      };

      // Mock author does not exist
      ctx.db.Author.findByPk.mockResolvedValue(null);

      await expect(createBookHandler(ctx, input)).rejects.toThrow(
        "Author with ID 550e8400-e29b-41d4-a716-446655440000 not found"
      );
    });

    it("should throw validation error for invalid input", async () => {
      const input = {
        title: "", // Invalid: empty title
        authorId: "invalid-uuid", // Invalid: not a UUID
      };

      await expect(createBookHandler(ctx, input)).rejects.toThrow();
    });
  });

  describe("createAuthorHandler", () => {
    it("should create an author", async () => {
      const input = { name: "Author", born_date: "1990-01-01" };
      ctx.db.Author.create.mockResolvedValue({ id: "auth-1", save: jest.fn() });
      const author = await createAuthorHandler(ctx, input);
      expect(ctx.db.Author.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Author" })
      );
      expect(author).toBeDefined();
    });
  });

  describe("addReviewHandler", () => {
    it("should add a review to book metadata", async () => {
      const input = {
        bookId: "550e8400-e29b-41d4-a716-446655440000",
        username: "user",
        rating: 5,
        comment: "Great!",
      };

      // Mock book exists
      ctx.db.Book.findByPk.mockResolvedValue({
        id: "550e8400-e29b-41d4-a716-446655440000",
      });

      const metadata = { reviews: [], average_rating: 0, save: jest.fn() };
      ctx.db.BookMetadata.findOne.mockResolvedValue(metadata);

      const result = await addReviewHandler(ctx, input);

      expect(ctx.db.Book.findByPk).toHaveBeenCalledWith(
        "550e8400-e29b-41d4-a716-446655440000"
      );
      expect(ctx.db.BookMetadata.findOne).toHaveBeenCalledWith({
        bookId: "550e8400-e29b-41d4-a716-446655440000",
      });
      expect(metadata.reviews.length).toBe(1);
      expect(result).toBeDefined();
    });

    it("should throw error if book does not exist", async () => {
      const input = {
        bookId: "550e8400-e29b-41d4-a716-446655440000",
        username: "user",
        rating: 5,
      };

      // Mock book does not exist
      ctx.db.Book.findByPk.mockResolvedValue(null);

      await expect(addReviewHandler(ctx, input)).rejects.toThrow(
        "Book with ID 550e8400-e29b-41d4-a716-446655440000 not found"
      );
    });

    it("should throw error if user has already reviewed the book", async () => {
      const input = {
        bookId: "550e8400-e29b-41d4-a716-446655440000",
        username: "user",
        rating: 5,
      };

      // Mock book exists
      ctx.db.Book.findByPk.mockResolvedValue({
        id: "550e8400-e29b-41d4-a716-446655440000",
      });

      const metadata = {
        reviews: [{ username: "user", rating: 4, comment: "Good" }],
        average_rating: 4,
        save: jest.fn(),
      };
      ctx.db.BookMetadata.findOne.mockResolvedValue(metadata);

      await expect(addReviewHandler(ctx, input)).rejects.toThrow(
        "User user has already reviewed this book"
      );
    });

    it("should throw validation error for invalid rating", async () => {
      const input = {
        bookId: "550e8400-e29b-41d4-a716-446655440000",
        username: "user",
        rating: 10, // Invalid: rating must be 1-5
      };

      await expect(addReviewHandler(ctx, input)).rejects.toThrow();
    });
  });
});
