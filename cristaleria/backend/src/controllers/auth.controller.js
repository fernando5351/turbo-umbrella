const boom = require('@hapi/boom');
const { models } = require('../../sequelize');
const jwt = require('jsonwebtoken');
const { Jwt } = require('../../config')
const bcrypt = require('bcrypt');
const UserController = require('./user.controller');

const userController = new UserController;

class Auth {
    async getByEmail(email) {
        const user = await models.User.findOne({
            where: {
                email
            },
            include: [
                {
                    model: models.Role,
                    as: 'Role',
                    include: [{
                        model: models.RolePermission,
                        as: 'Permissions'
                    }]
                }
            ],
        });
        return user;
    }

    sigInToken(user) {
        const payload = {
            sub: user.id,
            rol: user.roleId,
            status: user.status
        }
        const token = jwt.sign(payload, Jwt.secret, { expiresIn: '7d' })
        return token;
    }

    recoveryToken(user) {
        const payload = {
            sub: user.id,
            rol: user.roleId,
            status: user.status
        }
        const token = jwt.sign(payload, Jwt.recoverySecret, { expiresIn: '3h' })
        return token;
    }

    async readByEmail(email){
        const user = await models.User.findOne({
            include: [
                {
                    model: models.Role,
                    as: 'Role',
                    include: [{
                            model: models.RolePermission,
                            as: 'Permissions'
                        }]
                }
            ],
            attributes: { exclude: ['password', 'otpSecret'] },
            where: {
                email
            }
        });
        if (!user) {
            throw boom.notFound("Resource doesn't exist");
        }
        return user;
    }   

    async changePassword(jwt, oldPasword, newPassword) {
        if (oldPasword) {
            const oldPasword = await bcrypt.compare(oldPasword, user.dataValues.password);
            if (!oldPasword) throw new Error("La contraseña actual es incorrecta");
            const findUser = await userController.getById(jwt.sub)
            const password = await bcrypt.hash(newPassword, 10);
            await findUser.update({ password, status: true });
        } else {
            const findUser = await userController.getById(jwt.sub)
            const password = await bcrypt.hash(newPassword, 10);
            await findUser.update({ password, status: true, otpSecret: null });
            return findUser;
        }
    }
    
}

module.exports = Auth