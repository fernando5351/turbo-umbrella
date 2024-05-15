const userController = require('../src/controllers/user.controller')

async function checkStatus(err, req, res, next) {

  const service = new userController;
  const active = true;

  const user = await service.getById(req.user.sub)

  if (user && user.status === active) {
    next();
  } else {
    res.status(403).json({ error: "Usuario inactivo" });
  }
}

module.exports = checkStatus;
