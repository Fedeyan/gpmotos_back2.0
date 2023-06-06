const { Router } = require("express");
const { Users, Userdatas } = require("../sequelize/database");
const validateSession = require("../middlewares/validateSession");
const passport = require("passport");
const { registerValidator } = require("../middlewares/validators");
const { validationResult } = require("express-validator");

const users = Router();

users.post("/register", registerValidator, async function (req, res) {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.json(result.array());
  const {
    firstName,
    lastName,
    username,
    email,
    phone_areacode,
    phone,
    password,
  } = req.body;

  const find =
    (await Users.findOne({
      where: {
        username: username,
      },
    })) ||
    (await Users.findOne({
      where: {
        email: email,
      },
    }));

  if (find) return res.json("El usuario ya existe");

  let newUser = null;

  Users.create({
    firstName,
    lastName,
    username,
    email,
    phone_areacode,
    phone,
    password,
  })
    .then(async function (user) {
      newUser = user;
      return Userdatas.create({
        cart: [],
      });
    })
    .then(async function (Userdata) {
    
      await newUser.setUserdata(Userdata);
      return res.json("El usuario " + username + " se ha creado con exito");
    })
    .catch((err) => res.json(err));
});

users.post("/auth/login", passport.authenticate("local"), (req, res) =>
  res.json(true)
);

users.get("/user", validateSession, async function (req, res) {
  if (req.user) {
    Users.findOne({
      where: {
        id: req.user.id,
      },
      include: Userdatas,
    }).then((user) => {
      if (user) return res.json(user);
      return res.json("Se ha producido un error, reintente.");
    });
  } else {
    req.logOut(function (err) {
      if (err) throw new Error("Error");
      res.json("La sesion ha expirado, Inicia sesion.");
    });
  }
});

users.post("/auth/logout", validateSession, function (req, res) {
  req.logOut(function (error) {
    if (error) throw new Error(error);
  });
  return res.json("Has cerrado sesion");
});

users.get("/checksession", function (req, res) {
  if (!req.isAuthenticated() || !req.user) return res.json(false);
  return res.json(true);
});

module.exports = users;
