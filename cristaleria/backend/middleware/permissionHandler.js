const UserController = require("../src/controllers/user.controller");
const boom = require("@hapi/boom");

const service = new UserController();

async function Ican(req, res, next) {
  try {
    let path = req.path;
    path = path.split("/");

    const method = req.method;
    const payload = req.user;

    const user = await service.getById(payload.sub);
    if (!user.status) {
      throw  boom.unauthorized('Usuario locked');
    }
    const role = user.Role;

    if (!role.status) {
      throw boom.locked('Your role is inactive');
    }

    let permissionFound = false;
    let message = "You do not have authorization to this resource";

    for (let i = 0; i < role.Permissions.length; i++) {
      const element = role.Permissions[i];

      if (path[2] === 'permissions') {
        path[1] = 'permissions';
      }

      if (element.accessName === path[1]) {
        permissionFound = true;

        switch (method) {
          case "GET":
            if (element.onlyMyRecord && !isNaN(path[2]) ) {
              if (payload.sub !== path[2]) {
                throw boom.locked(message);
              }
              break;
            }
          case "GET":
            if (!element.getById && !isNaN(path[2]) ) {
              throw boom.locked(message);
            }
          case "GET":
            if (!element.canRead) {
              throw boom.locked(message);
            }
            break;
          case "POST":
            if (!element.canCreate) {
              throw boom.locked(message);
            }
            break;
          case "PATCH":
            if (!element.canUpdate) {
              throw boom.locked(message);
            }
            break;
          case "DELETE":
            if (!element.canDelete) {
              throw boom.locked(message);
            }
            break;
          default:
            throw boom.locked("Unsupported method");
        }
        break;
      }
    }

    if (!permissionFound) {
      throw boom.locked(message);
    }

    return next();
  } catch (error) {
    next(error);
  }
}

module.exports = Ican;
