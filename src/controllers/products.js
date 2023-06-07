const express = require("express");
const { Router } = require("express");
const { validatePermissions } = require("../middlewares/validatePermissions");
const validateSession = require("../middlewares/validateSession");
const multer = require("multer");
const path = require("path");
const { Products, Users } = require("../sequelize/database");
const { createProductValidator } = require("../middlewares/validators");
const { validationResult } = require("express-validator");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "storage", "productImage"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const products = Router();

products.post(
  "/products",
  validateSession,
  validatePermissions,
  createProductValidator,
  upload.single("productImage"),
  async function (req, res) {
    const { code, name, brand, model, description, stock } = req.body;
    const result = validationResult(req);
    if (!result.isEmpty()) return res.json(result.array());

    const find = await Products.findOne({
      where: { code: code },
    });

    if (find) return res.json("El producto ya existe.");
    Products.create({
      code,
      name,
      brand,
      model,
      description,
      stock,
      image_url: req.file?.filename || null,
    }).then((product) => {
      if (!product) {
        return res.json("Se ha producido un error, reintente.");
      } else {
        global.io.emit("add_product")
        return res.json(
          "El producto " + code + " se ha agregado correctamente"
        );
      }
    });
  }
);

products.get("/products", async function (req, res) {
  Products.findAll()
    .then((products) => {
      return res.json(products.length ? products : "Sin articulos");
    })
    .catch((err) => res.json(err));
});

products.delete(
  "/products",
  validateSession,
  validatePermissions,
  async function (req, res) {
    const { code } = req.body;
    Products.destroy({ where: { code: code } })
      .then((p) => {
        if (p) return res.json("El producto se ha eliminado correctamente");
        else return res.json("Error al eliminar");
      })
      .catch((err) => res.json(err));
  }
);

//getImage
products.use(
  "/productimg",
  express.static(path.join(__dirname, "..", "storage", "productImage"))
);

module.exports = products;
