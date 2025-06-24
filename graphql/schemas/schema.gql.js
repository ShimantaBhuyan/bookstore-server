export const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    biography: String
    born_date: String
    books: [Book!]
  }

  type Book {
    id: ID!
    title: String!
    description: String
    published_date: String
    author: Author!
    metadata: BookMetadata
  }

  type BookMetadata {
    bookId: ID!
    reviews: [Review!]
    average_rating: Float!
    cover_image_url: String
  }

  type Review {
    username: String!
    rating: Int!
    comment: String
    createdAt: String!
  }

  type BookListResult {
    books: [Book!]!
    totalCount: Int!
  }

  type Query {
    books(
      offset: Int
      limit: Int
      searchTerm: String
      authorId: ID
    ): BookListResult!
    book(id: ID!): Book
    authors: [Author!]!
    author(id: ID!): Author!
  }

  input BookInput {
    title: String!
    description: String
    published_date: String
    authorId: ID!
    cover_image_url: String
  }

  input AuthorInput {
    name: String!
    biography: String
    born_date: String
  }

  input ReviewInput {
    bookId: ID!
    username: String!
    rating: Int!
    comment: String
  }

  type Mutation {
    createBook(input: BookInput!): Book!
    createAuthor(input: AuthorInput!): Author!
    addReview(input: ReviewInput!): BookMetadata!
  }
`;
