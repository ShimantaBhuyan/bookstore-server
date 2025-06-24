import DataLoader from "dataloader";
import { models } from "../index.js";

export const getAllModelLoaders = () => {
  return {
    book: new DataLoader(async (ids) => {
      const books = await models.Book.findAll({
        where: { id: ids },
        include: [{ model: models.Author, as: "author" }],
      });
      return ids.map((id) => books.find((book) => book.id === id));
    }),

    author: new DataLoader(async (ids) => {
      const authors = await models.Author.findAll({
        where: { id: ids },
      });
      return ids.map((id) => authors.find((author) => author.id === id));
    }),
  };
};
