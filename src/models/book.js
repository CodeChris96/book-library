module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50],
      },
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        len: [1, 50],
      },
    },
    ISBN: {
      type: DataTypes.STRING,
      unique: true,
    },
  };

  const BookModel = connection.define("Book", schema);
  return BookModel;
};
