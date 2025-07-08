// Validation utility functions
import { GraphQLError } from "graphql";

// UUID validation regex
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// URL validation regex
const URL_REGEX =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation error class
export class ValidationError extends GraphQLError {
  constructor(message, field = null) {
    super(message, {
      extensions: {
        code: "VALIDATION_ERROR",
        field,
      },
    });
  }
}

// Generic validation functions
export const validators = {
  required: (value, fieldName) => {
    if (value === null || value === undefined || value === "") {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    return true;
  },

  string: (value, fieldName, options = {}) => {
    if (value !== undefined && value !== null) {
      if (typeof value !== "string") {
        throw new ValidationError(`${fieldName} must be a string`, fieldName);
      }

      if (options.minLength && value.length < options.minLength) {
        throw new ValidationError(
          `${fieldName} must be at least ${options.minLength} characters long`,
          fieldName
        );
      }

      if (options.maxLength && value.length > options.maxLength) {
        throw new ValidationError(
          `${fieldName} must be no more than ${options.maxLength} characters long`,
          fieldName
        );
      }

      if (options.trim && value.trim() === "") {
        throw new ValidationError(`${fieldName} cannot be empty`, fieldName);
      }
    }
    return true;
  },

  number: (value, fieldName, options = {}) => {
    if (value !== undefined && value !== null) {
      const num = Number(value);
      if (isNaN(num)) {
        throw new ValidationError(
          `${fieldName} must be a valid number`,
          fieldName
        );
      }

      if (options.min !== undefined && num < options.min) {
        throw new ValidationError(
          `${fieldName} must be at least ${options.min}`,
          fieldName
        );
      }

      if (options.max !== undefined && num > options.max) {
        throw new ValidationError(
          `${fieldName} must be no more than ${options.max}`,
          fieldName
        );
      }

      if (options.integer && !Number.isInteger(num)) {
        throw new ValidationError(`${fieldName} must be an integer`, fieldName);
      }
    }
    return true;
  },

  uuid: (value, fieldName) => {
    if (value !== undefined && value !== null) {
      if (!UUID_REGEX.test(value)) {
        throw new ValidationError(
          `${fieldName} must be a valid UUID`,
          fieldName
        );
      }
    }
    return true;
  },

  url: (value, fieldName) => {
    if (value !== undefined && value !== null) {
      if (!URL_REGEX.test(value)) {
        throw new ValidationError(
          `${fieldName} must be a valid URL`,
          fieldName
        );
      }
    }
    return true;
  },

  email: (value, fieldName) => {
    if (value !== undefined && value !== null) {
      if (!EMAIL_REGEX.test(value)) {
        throw new ValidationError(
          `${fieldName} must be a valid email address`,
          fieldName
        );
      }
    }
    return true;
  },

  date: (value, fieldName) => {
    if (value !== undefined && value !== null) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new ValidationError(
          `${fieldName} must be a valid date`,
          fieldName
        );
      }
    }
    return true;
  },

  rating: (value, fieldName) => {
    validators.number(value, fieldName, { min: 1, max: 5, integer: true });
    return true;
  },
};

// Specific validation functions for each input type
export const validateBookInput = (input) => {
  validators.required(input.title, "title");
  validators.string(input.title, "title", {
    minLength: 1,
    maxLength: 255,
    trim: true,
  });

  validators.required(input.authorId, "authorId");
  validators.uuid(input.authorId, "authorId");

  if (input.description) {
    validators.string(input.description, "description", { maxLength: 5000 });
  }

  if (input.published_date) {
    validators.date(input.published_date, "published_date");
  }

  if (input.cover_image_url) {
    validators.url(input.cover_image_url, "cover_image_url");
  }

  return true;
};

export const validateAuthorInput = (input) => {
  validators.required(input.name, "name");
  validators.string(input.name, "name", {
    minLength: 1,
    maxLength: 255,
    trim: true,
  });

  if (input.biography) {
    validators.string(input.biography, "biography", { maxLength: 5000 });
  }

  if (input.born_date) {
    validators.date(input.born_date, "born_date");
  }

  return true;
};

export const validateReviewInput = (input) => {
  validators.required(input.bookId, "bookId");
  validators.uuid(input.bookId, "bookId");

  validators.required(input.username, "username");
  validators.string(input.username, "username", {
    minLength: 1,
    maxLength: 50,
    trim: true,
  });

  validators.required(input.rating, "rating");
  validators.rating(input.rating, "rating");

  if (input.comment) {
    validators.string(input.comment, "comment", { maxLength: 1000 });
  }

  return true;
};

export const validateQueryParams = (params) => {
  if (params.id) {
    validators.uuid(params.id, "id");
  }

  if (params.authorId) {
    validators.uuid(params.authorId, "authorId");
  }

  if (params.offset !== undefined) {
    validators.number(params.offset, "offset", { min: 0, integer: true });
  }

  if (params.limit !== undefined) {
    validators.number(params.limit, "limit", {
      min: 1,
      max: 100,
      integer: true,
    });
  }

  if (params.searchTerm) {
    validators.string(params.searchTerm, "searchTerm", {
      minLength: 1,
      maxLength: 100,
      trim: true,
    });
  }

  return true;
};

export const validateEditBookInput = (input) => {
  validators.required(input.id, "id");
  validators.uuid(input.id, "id");

  if (input.title !== undefined) {
    validators.required(input.title, "title");
    validators.string(input.title, "title", {
      minLength: 1,
      maxLength: 255,
      trim: true,
    });
  }

  if (input.description !== undefined) {
    validators.string(input.description, "description", { maxLength: 5000 });
  }

  if (input.cover_image_url !== undefined) {
    validators.url(input.cover_image_url, "cover_image_url");
  }

  return true;
};

export const validateEditAuthorInput = (input) => {
  validators.required(input.id, "id");
  validators.uuid(input.id, "id");

  if (input.name !== undefined) {
    validators.required(input.name, "name");
    validators.string(input.name, "name", {
      minLength: 1,
      maxLength: 255,
      trim: true,
    });
  }

  if (input.biography !== undefined) {
    validators.string(input.biography, "biography", { maxLength: 5000 });
  }

  if (input.born_date !== undefined) {
    validators.date(input.born_date, "born_date");
  }

  return true;
};
