# Bookstore - Server

The server side for Bookstore application using GraphQL, Apollo, Express, Sequelize, and Mongoose.

## Prerequisites

- Node.js
- pnpm
- PostgreSQL and MongoDB

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/ShimantaBhuyan/bookstore-server.git
cd bookstore-server
```

### 2. Install dependencies

```
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory. Check out .env.example for variables which need to be set.

### 4. Start the development servers

```
node server.js
```

### 5. Useful Scripts

- `pnpm run dev` - Start express server

## Project Structure

- `server.js` - Main Express/Apollo server entry point
- Models are defined in `db/models`
- GraphQL schema, queries and mutations are defined in `graphql` folder

## API Endpoint

- GraphQL endpoint: `http://localhost:4000/api`
