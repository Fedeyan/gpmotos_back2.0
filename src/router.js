const express = require("express");
const Router = express.Router;
const users = require("./controllers/users");
const products = require("./controllers/products");
const { transporter } = require("./middlewares/nodemailer");
const { mailer } = require("./controllers/mailerController");
const router = Router();

//serverStatus
router.get("/status", function (req, res) {
  res.send("Server OK");
});

//users
router.use(users);

//products
router.use(products);

//testMail
router.use("/mail_service", mailer);

module.exports = router;
