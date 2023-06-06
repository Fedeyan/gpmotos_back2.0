const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "cuentaparaestudiosf@gmail.com",
    pass: "hwbirjevilfpctqk",
  },
});

transporter.verify().then(function () {
  console.log("Servicio de mail preparado.");
});

module.exports = { transporter };
