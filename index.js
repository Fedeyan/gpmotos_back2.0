const express = require("express");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { createServer } = require("http");
const { Server } = require("socket.io");
const { config } = require("dotenv");
const router = require("./src/router");
const {
  Users,
  userDatabase,
  productsDatabase,
} = require("./src/sequelize/database");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

config({ path: "./.env" });
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const { PORT } = process.env;

//app_use
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: "hash123",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new localStrategy(function (username, password, cb) {
    Users.findOne({ where: { username: username } })
      .then((user) => {
        if (!user) return cb("El usuario no existe");
        bcrypt.compare(password, user.password, function (err, result) {
          if (result) {
            return cb(null, { id: user.id, username: user.username });
          } else return cb("Contraseña incorrecta");
        });
      })
      .catch();
  })
);

passport.serializeUser(function (user, cb) {
  return cb(null, user);
});
passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

//router
app.use("/images", express.static(path.join(__dirname, "storage")));

app.use(router);

//start
userDatabase.sync({ force: true }).then(function () {
  console.log("Base de datos de los usuarios inicializada correctamente...");
  productsDatabase.sync().then(function () {
    console.log("Base de datos de los productos inicializada correctamente...");
    app.listen(PORT, function () {
      console.log(`Servidor operativo en el puerto ${PORT}`);
    });
  });
});


