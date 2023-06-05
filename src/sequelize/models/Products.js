const { DataTypes } = require("sequelize");

const productsModel = (sequelize) => {
  const ProductsModel = sequelize.define("Products", {
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING,
      defaultValue: "generic",
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });
  return ProductsModel;
};

module.exports = {
  productsModel,
};
