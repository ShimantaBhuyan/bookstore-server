import mongoose from "mongoose";
const { Schema } = mongoose;

const bookMetadataSchema = new Schema({
  bookId: {
    // Links to PostgreSQL Book ID (UUID)
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  reviews: [
    {
      username: String,
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  average_rating: {
    type: Number,
    default: 0,
  },
  cover_image_url: String,
});

export default mongoose.model("BookMetadata", bookMetadataSchema);
