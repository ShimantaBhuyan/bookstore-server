import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Book extends Model {}
  Book.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      published_date: {
        type: DataTypes.DATEONLY,
      },
      authorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Authors",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );

  Book.associate = (models) => {
    Book.belongsTo(models.Author, {
      foreignKey: "authorId",
      as: "author",
    });
  };

  return Book;
};
