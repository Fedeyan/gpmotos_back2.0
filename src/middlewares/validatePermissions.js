const { Users, Userdatas } = require("../sequelize/database");

async function validatePermissions(req, res, next) {
  Users.findOne({
    where: {
      id: req.user?.id || null,
    },
    include: Userdatas,
  }).then((user) => {
    if (!user) return res.json("Se ha producido un error.");
    if (user.dataValues.Userdata.role !== "admin") {
      return res.json("No tienes los permisos necesarios.");
    }
    return next();
  });
}

module.exports = {
  validatePermissions,
};
