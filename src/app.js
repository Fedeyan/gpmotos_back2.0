const express = require("express");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const { Server } = require("socket.io");
const { config } = require("dotenv");
const router = require("./router");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");
const { Users } = require("./sequelize/database");
const { SocketActionCreator } = require("./config/socket");

config({ path: "../.env" });
const app = express();
const http = require("http").Server(app);
const io = new Server(http, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

global.io = io;

//app_use
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
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

io.on("connect", function (socket) {
    require("./config/socket.js")(socket, io)
});

//start
module.exports = {
  http,
};
