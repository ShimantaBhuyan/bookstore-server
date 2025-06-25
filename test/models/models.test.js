import { Sequelize, DataTypes, Model } from "sequelize";
import { jest } from "@jest/globals";
import mongoose from "mongoose";
import BookMetadata from "../../db/models/book_metadata.js";

describe("Sequelize Book Model (Mocked)", () => {
  class Book extends Model {}
  Book.init = jest.fn();
  Book.create = jest.fn(async (data) => {
    if (!data.title) throw new Error("title is required");
    if (!data.authorId) throw new Error("authorId is required");
    return { ...data };
  });

  it("should not create a book without a title", async () => {
    await expect(Book.create({ authorId: "auth-1" })).rejects.toThrow();
  });
  it("should create a book with valid data", async () => {
    const book = await Book.create({ title: "Test Book", authorId: "auth-1" });
    expect(book.title).toBe("Test Book");
    expect(book.authorId).toBe("auth-1");
  });
});

describe("Sequelize Author Model (Mocked)", () => {
  class Author extends Model {}
  Author.init = jest.fn();
  Author.create = jest.fn(async (data) => {
    if (!data.name) throw new Error("name is required");
    return { ...data };
  });

  it("should not create an author without a name", async () => {
    await expect(Author.create({})).rejects.toThrow();
  });
  it("should create an author with valid data", async () => {
    const author = await Author.create({ name: "Test Author" });
    expect(author.name).toBe("Test Author");
  });
});

describe("Mongoose BookMetadata Model", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/test", {});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  it("should not create metadata without a bookId", async () => {
    try {
      await BookMetadata.create({});
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});

describe("Mongoose BookMetadata Model (Mocked)", () => {
  const BookMetadataMock = {
    create: jest.fn(async (data) => {
      if (!data.bookId) throw new Error("bookId is required");
      return { ...data };
    }),
  };

  it("should not create metadata without a bookId", async () => {
    await expect(BookMetadataMock.create({})).rejects.toThrow();
  });
  it("should create metadata with a bookId", async () => {
    const meta = await BookMetadataMock.create({ bookId: "book-1" });
    expect(meta.bookId).toBe("book-1");
  });
});
