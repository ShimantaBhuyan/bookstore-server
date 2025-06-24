import { Model, DataTypes } from "sequelize";

export default (sequelize) => {
  class Author extends Model {}
  Author.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      biography: {
        type: DataTypes.TEXT,
      },
      born_date: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      sequelize,
      modelName: "Author",
    }
  );

  Author.associate = (models) => {
    Author.hasMany(models.Book);
  };

  return Author;
};
