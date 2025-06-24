import { Sequelize } from "sequelize";
import mongoose from "mongoose";
import Author from "./models/author.js";
import Book from "./models/book.js";
import BookMetadata from "./models/book_metadata.js";

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {});

// Initialize Mongoose
await mongoose.connect(process.env.MONGODB_URL);

// Initialize models
const models = {
  Author: Author(sequelize),
  Book: Book(sequelize),
  BookMetadata: BookMetadata,
};

// Set up associations
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, models };
