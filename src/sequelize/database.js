const { Sequelize } = require("sequelize");
const { config } = require("dotenv");
const { userModel, userData } = require("./models/User");
const { productsModel } = require("./models/Products");
const { whitelistModel } = require("./models/Whitelist");

//start code
config();

//vars
const { USER_DB, PRODUCTS_DB } = process.env;

//init db
const userDatabase = new Sequelize(USER_DB, {
  logging: false,
});

const productsDatabase = new Sequelize(PRODUCTS_DB, {
  logging: false,
});

//inject Sqlz
//user
userModel(userDatabase);
userData(userDatabase);
whitelistModel(userDatabase)
//product
productsModel(productsDatabase);
const { Users, Userdatas, Whitelist } = userDatabase.models;
const { Products } = productsDatabase.models;
Userdatas.belongsTo(Users);
Users.hasOne(Userdatas);

module.exports = {
  userDatabase,
  productsDatabase,
  Users,
  Userdatas,
  Whitelist,
  Products,
};
