const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const whitelistModel = function (sequelize) {
  const WhitelistModel = sequelize.define(
    "Whitelist",
    {
      code: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      codetype: {
        type: DataTypes.STRING,
        defaultValue: "add_admin",
        validate: {
          isIn: [["add_admin"]],
        },
      },
    },
    {
      timestamps: false,
    }
  );
  return WhitelistModel;
};
module.exports = {
  whitelistModel,
};
