const { config } = require("dotenv");
const { http } = require("./src/app");
const { userDatabase, productsDatabase } = require("./src/sequelize/database");

config();

const { PORT } = process.env;
userDatabase.sync({ force: false }).then(function () {
  console.log("Base de datos de los usuarios inicializada correctamente...");
  productsDatabase.sync({ force: false }).then(function () {
    console.log("Base de datos de los productos inicializada correctamente...");
    http.listen(PORT, function () {
      console.log(`Servidor operativo en el puerto ${PORT}`);
    });
  });
});
