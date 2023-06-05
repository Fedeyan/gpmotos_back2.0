const express = require("express");
const { Router } = require("express");
const { validatePermissions } = require("../middlewares/validatePermissions");
const validateSession = require("../middlewares/validateSession");
const multer = require("multer");
const path = require("path");
const { Products } = require("../sequelize/database");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "storage", "productImage"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const products = Router();

products.post(
  "/products",
  validateSession,
  validatePermissions,
  upload.single("productImage"),
  async function (req, res) {
    res.json("Test");
  }
);
products.get("/products", async function (req, res) {
  Products.findAll()
    .then((products) => {
      return res.json(products.length ? products : "Sin articulos");
    })
    .catch((err) => res.json(err));
});

//getImage
products.use(
  "/productimg",
  express.static(path.join(__dirname, "..", "storage", "productImage"))
);

module.exports = products;
