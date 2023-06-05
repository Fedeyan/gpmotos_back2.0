const { body } = require("express-validator");

const registerValidator = [
  body("firstName").isLength(1).isString(),
  body("lastName").isLength(1).isString(),
  body("username").isLength(3).isString(),
  body("email").isEmail(),
  body("phone_areacode").isNumeric(),
  body("phone").isNumeric(),
  body("password").isLength(6).isString(),
];

module.exports = {
  registerValidator,
};
