module.exports = (connection, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  const ReaderModel = connection.define("Reader", schema);
  return ReaderModel;
};
