const express = require("express");
const Router = express.Router;
const users = require("./controllers/users");
const products = require("./controllers/products");
const { transporter } = require("./middlewares/nodemailer");
const { mailer } = require("./controllers/mailerController");
const { verifier } = require("./controllers/verifyer");
const shophandler = require("./controllers/shophandler");
const router = Router();

//serverStatus
router.get("/status", function (req, res) {
  res.send("Server OK");
});

//users
router.use(users);

//products
router.use(products);

//mail_service
router.use("/mail_service", mailer);

//verify_user
router.use("/verify_user", verifier);

//shophandler
router.use("/shop", shophandler);

module.exports = router;
