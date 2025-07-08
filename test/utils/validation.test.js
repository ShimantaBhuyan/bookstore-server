import { jest } from "@jest/globals";
import {
  ValidationError,
  validators,
  validateBookInput,
  validateAuthorInput,
  validateReviewInput,
  validateQueryParams,
} from "../../utils/validation.js";

describe("Validation Utilities", () => {
  describe("ValidationError", () => {
    it("should create a validation error with message and field", () => {
      const error = new ValidationError("Test error", "testField");
      expect(error.message).toBe("Test error");
      expect(error.extensions.code).toBe("VALIDATION_ERROR");
      expect(error.extensions.field).toBe("testField");
    });
  });

  describe("validators.required", () => {
    it("should pass for valid values", () => {
      expect(() => validators.required("test", "field")).not.toThrow();
      expect(() => validators.required(123, "field")).not.toThrow();
      expect(() => validators.required(true, "field")).not.toThrow();
    });

    it("should throw for invalid values", () => {
      expect(() => validators.required(null, "field")).toThrow(
        "field is required"
      );
      expect(() => validators.required(undefined, "field")).toThrow(
        "field is required"
      );
      expect(() => validators.required("", "field")).toThrow(
        "field is required"
      );
    });
  });

  describe("validators.uuid", () => {
    it("should pass for valid UUIDs", () => {
      expect(() =>
        validators.uuid("550e8400-e29b-41d4-a716-446655440000", "field")
      ).not.toThrow();
      expect(() =>
        validators.uuid("6ba7b810-9dad-11d1-80b4-00c04fd430c8", "field")
      ).not.toThrow();
    });

    it("should throw for invalid UUIDs", () => {
      expect(() => validators.uuid("invalid-uuid", "field")).toThrow(
        "field must be a valid UUID"
      );
      expect(() => validators.uuid("123", "field")).toThrow(
        "field must be a valid UUID"
      );
    });

    it("should pass for null/undefined values", () => {
      expect(() => validators.uuid(null, "field")).not.toThrow();
      expect(() => validators.uuid(undefined, "field")).not.toThrow();
    });
  });

  describe("validators.rating", () => {
    it("should pass for valid ratings", () => {
      expect(() => validators.rating(1, "field")).not.toThrow();
      expect(() => validators.rating(3, "field")).not.toThrow();
      expect(() => validators.rating(5, "field")).not.toThrow();
    });

    it("should throw for invalid ratings", () => {
      expect(() => validators.rating(0, "field")).toThrow(
        "field must be at least 1"
      );
      expect(() => validators.rating(6, "field")).toThrow(
        "field must be no more than 5"
      );
      expect(() => validators.rating(3.5, "field")).toThrow(
        "field must be an integer"
      );
    });
  });

  describe("validators.url", () => {
    it("should pass for valid URLs", () => {
      expect(() =>
        validators.url("https://example.com", "field")
      ).not.toThrow();
      expect(() =>
        validators.url("http://test.org/path", "field")
      ).not.toThrow();
    });

    it("should throw for invalid URLs", () => {
      expect(() => validators.url("invalid-url", "field")).toThrow(
        "field must be a valid URL"
      );
      expect(() => validators.url("ftp://example.com", "field")).toThrow(
        "field must be a valid URL"
      );
    });
  });

  describe("validateBookInput", () => {
    it("should pass for valid book input", () => {
      const input = {
        title: "Test Book",
        authorId: "550e8400-e29b-41d4-a716-446655440000",
        description: "A test book",
        published_date: "2024-01-01",
        cover_image_url: "https://example.com/cover.jpg",
      };
      expect(() => validateBookInput(input)).not.toThrow();
    });

    it("should throw for missing required fields", () => {
      expect(() => validateBookInput({})).toThrow("title is required");
      expect(() => validateBookInput({ title: "Test" })).toThrow(
        "authorId is required"
      );
    });

    it("should throw for invalid field types", () => {
      const input = {
        title: "Test Book",
        authorId: "invalid-uuid",
      };
      expect(() => validateBookInput(input)).toThrow(
        "authorId must be a valid UUID"
      );
    });
  });

  describe("validateAuthorInput", () => {
    it("should pass for valid author input", () => {
      const input = {
        name: "Test Author",
        biography: "A test author",
        born_date: "1980-01-01",
      };
      expect(() => validateAuthorInput(input)).not.toThrow();
    });

    it("should throw for missing name", () => {
      expect(() => validateAuthorInput({})).toThrow("name is required");
    });
  });

  describe("validateReviewInput", () => {
    it("should pass for valid review input", () => {
      const input = {
        bookId: "550e8400-e29b-41d4-a716-446655440000",
        username: "testuser",
        rating: 4,
        comment: "Great book!",
      };
      expect(() => validateReviewInput(input)).not.toThrow();
    });

    it("should throw for invalid input", () => {
      const input = {
        bookId: "invalid-uuid",
        username: "testuser",
        rating: 10,
      };
      expect(() => validateReviewInput(input)).toThrow();
    });
  });

  describe("validateQueryParams", () => {
    it("should pass for valid query params", () => {
      const params = {
        id: "550e8400-e29b-41d4-a716-446655440000",
        offset: 0,
        limit: 10,
        searchTerm: "test",
      };
      expect(() => validateQueryParams(params)).not.toThrow();
    });

    it("should throw for invalid pagination params", () => {
      expect(() => validateQueryParams({ offset: -1 })).toThrow(
        "offset must be at least 0"
      );
      expect(() => validateQueryParams({ limit: 0 })).toThrow(
        "limit must be at least 1"
      );
      expect(() => validateQueryParams({ limit: 200 })).toThrow(
        "limit must be no more than 100"
      );
    });
  });
});
