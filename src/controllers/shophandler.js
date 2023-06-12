const { Router } = require("express");
const validateSession = require("../middlewares/validateSession");
const { Userdatas } = require("../sequelize/database");

const shophandler = Router();

//addcart
shophandler.post("/addcart", validateSession, async function (req, res) {
  try {
    let can = false;
    const { cart_add } = req.body;
    console.log(cart_add);
    if (!cart_add) {
      return res.json("Se ha producido un error.");
    }

    const userdata = await Userdatas.findOne({
      where: { id: req.user?.id || null },
    });

    if (!userdata) {
      return res.json("Debes registrarte e iniciar sesion para continuar");
    }

    if (Array.isArray(cart_add)) {
      for (let i = 0; i < cart_add.length; i++) {
        if (typeof cart_add[i] !== "object") {
          can = false;
          break;
        }
        if (!cart_add[i].id || !cart_add[i].cant) {
          can = false;
          break;
        }

        if (
          typeof cart_add[i].id !== "number" ||
          typeof cart_add[i].cant !== "number"
        ) {
          can = false;
          break;
        }

        can = true;
      }
    } else {
      if (typeof cart_add === "object") {
        if (!cart_add.id || !cart_add.cant) {
          console.log("err 49");
          can = false;
        }
        if (
          typeof cart_add.id !== "number" ||
          typeof cart_add.id !== "number"
        ) {
          can = false;
          console.log("err 56");
        }

        can = true;
      } else {
        console.log("err 60");
        can = false;
      }
    }

    if (!can) {
      return res.json(
        "No se puede continuar porque hay datos invalidos en el formulario"
      );
    }

    const postData = [...userdata.cart];

    if (userdata) {
      Array.isArray(cart_add)
        ? postData.push(...cart_add)
        : postData.push(cart_add);
      userdata
        .update(
          {
            cart: postData,
          },
          { where: { id: userdata.id } }
        )
        .then((r) => {
          if (r) {
            return res.json("");
          }
        });
    } else {
      res.json("false");
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = shophandler;
