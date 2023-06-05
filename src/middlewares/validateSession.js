function validateSession(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.json("Inicia sesion para continuar");
  }
  return "Se ha producido un error";
}
module.exports = validateSession;
