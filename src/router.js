const express = require("express");
const Router = express.Router;
const users = require("./controllers/users");
const products = require("./controllers/products");
const router = Router();

//serverStatus
router.get("/status", function (req, res) {
  res.send("Server OK");
});

//users
router.use(users);

//products
router.use(products);


module.exports = router;
