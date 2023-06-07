"use strict";

var _require = require("dotenv"),
    config = _require.config;

var _require2 = require("./src/app"),
    http = _require2.http;

var _require3 = require("./src/sequelize/database"),
    userDatabase = _require3.userDatabase,
    productsDatabase = _require3.productsDatabase;

config();
var PORT = process.env.PORT;
userDatabase.sync({
  force: false
}).then(function () {
  console.log("Base de datos de los usuarios inicializada correctamente...");
  productsDatabase.sync({
    force: true
  }).then(function () {
    console.log("Base de datos de los productos inicializada correctamente...");
    http.listen(PORT, function () {
      console.log("Servidor operativo en el puerto ".concat(PORT));
    });
  });
});