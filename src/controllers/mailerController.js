const { transporter } = require("../middlewares/nodemailer");
const validateSession = require("../middlewares/validateSession");
const { generateVerify } = require("../middlewares/verifygen");
const { Users, Userdatas } = require("../sequelize/database");
const mailer = require("express").Router();

class Mail {
  constructor(from, to, subject, text, html) {
    (this.from = from),
      (this.to = to),
      (this.subject = subject),
      (this.text = text),
      (this.html = html);
  }
}

mailer.post("/verify", validateSession, async function (req, res) {
  const user = await Users.findOne({
    where: { id: req.user?.id },
    include: Userdatas,
  });

  const userdata = await Userdatas.findOne({
    where: {
      id: user.dataValues.Userdata?.UserId || null,
    },
  });

  const code = generateVerify();
  await userdata.update(
    {
      verifycode: code,
    },
    {
      where: { UserId: user.id },
    }
  );
  if (user) {
    await transporter.sendMail(
      new Mail(
        "GP Motos",
        user.email,
        `Mensaje de verificacion: Bienvenido Federico Carusso su codigo de verificacion es ${code}`,
        `Bienvenido Federico Carusso, gracias por registrarse en nuestra plataforma, su codigo de verificacion es ${code}`,
        `<b>Bienvenido Federico Carusso, gracias por registrarse en GP Motos, su codigo de verificacion es ${code}</b>`
      )
    );
    res.send("El mail se ha enviado con exito");
  } else {
    return res.json("Se ha producido un error inesperado.");
  }
});

module.exports = { mailer };
