const validateSession = require("../middlewares/validateSession");
const { Whitelist, Userdatas, Users } = require("../sequelize/database");

const verifier = require("express").Router();

verifier.post("/mail", validateSession, async function (req, res) {
  const { verifycode } = req.body;
  console.log(verifycode)
  const user = await Users.findOne({
    where: {
      id: req.user?.id || null,
    },
    include: Userdatas,
  });
  const userdata = await Userdatas.findOne({
    where: {
      UserId: user.id,
    },
  });
  


  if (!user || !userdata) return res.json("Se ha producido un error");


  if (userdata.verifycode === parseInt(verifycode)) {
    
    userdata
      .update({
        verified: true,
      })
      .then(function (response) {
        return res.json("Tu mail ha sido verificado");
      });
  } else {
    return res.json("Tu codigo de verificacion es incorrecto.");
  }
});

verifier.post("/admin", validateSession, async function (req, res) {
  const { verifycode } = req.body;
  const user = await Users.findOne({ where: { id: req.user?.id || null } });
  const userdata = await Userdatas.findOne({ where: { UserId: user.id } });
  if (!user || !userdata) return res.json("El usuario no existe");
  if (!userdata.verified)
    return res.json("Verifica tu cuenta antes de continuar");

  const whitelistCode = await Whitelist.findOne({
    where: {
      code: verifycode || null,
    },
  });

  if (!whitelistCode) return res.json("El codigo ingresado es invalido");

  if (whitelistCode.codetype === "add_admin") {
    userdata
      .update({
        role: "admin",
      })
      .then((response) => {
        if (!response) return res.json("Se ha producido un error");
        return res.json(
          `Bienvenido a la administracion de GP Motos ${user.username}, en unos segundos habilitaremos tu panel`
        );
      });
  } else return res.json("El codigo que tienes no posee permisos");
});

module.exports = {
  verifier,
};
