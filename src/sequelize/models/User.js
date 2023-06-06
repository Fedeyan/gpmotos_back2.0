const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const userModel = (sequelize) => {
  const UserModel = sequelize.define("Users", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone_areacode: {
      type: DataTypes.INTEGER,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  UserModel.beforeCreate(function (user, options) {
    return bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
      })
      .catch((error) => {
        throw new Error(error);
      });
  });
  return userModel;
};

const userData = (sequelize) => {
  const UserDataModel = sequelize.define("Userdatas", {
    role: {
      type: DataTypes.STRING,
      defaultValue: "customer",
      validate: {
        isIn: [["admin", "employee", "customer"]],
      },
    },
    cart: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: true,
    },
    verifycode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    notifications: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [
        JSON.stringify({
          title: "Bienvenido",
          preview: "Gracias por registrarte en GP Motos",
          link: "null",
        }),
      ],
    },
  });
  UserDataModel.beforeUpdate(function (user, options) {
    if (user.changed("verifycode")) {
      bcrypt
        .hash(user.verifycode.toString(), 10)
        .then((hash) => {
          user.verifycode = hash;
        })
        .catch((err) => console.log(err));
    }
  });
  return UserDataModel;
};

module.exports = {
  userModel,
  userData,
};
