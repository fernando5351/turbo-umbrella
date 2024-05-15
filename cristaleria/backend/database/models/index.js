const { Role, RoleModel } = require('./role.model');
const { RolePermissions, RolePermissionModel } = require('./rolePermission.model');
const { User, UsersModel } = require('./user.model');
const { Entry, EntryModel  } = require('./entry.model');
const { Exit, ExitModel } = require('./exit.model');
const { Product, ProductModel  } = require('./product.model');

function modelsHandler(sequelize) {
    Role.init(RoleModel, Role.config(sequelize));
    RolePermissions.init(RolePermissionModel, RolePermissions.config(sequelize));
    User.init(UsersModel, User.config(sequelize));
    Entry.init(EntryModel, Entry.config(sequelize));
    Exit.init(ExitModel, Exit.config(sequelize));
    Product.init(ProductModel, Product.config(sequelize));

    //associations
    Role.associate(sequelize.models);
    RolePermissions.associate(sequelize.models);
    User.associate(sequelize.models);
    Entry.associate(sequelize.models);
    Exit.associate(sequelize.models);
    Product.associate(sequelize.models);
}

module.exports = modelsHandler;