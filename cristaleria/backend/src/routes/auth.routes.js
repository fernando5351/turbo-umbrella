const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const validatorHandler = require('../../middleware/validatorHandler');
const configuration = require('../../config');
const passport = require('passport');
const boom = require('@hapi/boom');
const { login, changePassword, updatePassword, mail, recovery } = require('../schemas/auth.schema');
const UserController = require('../controllers/user.controller');
const fs = require('fs')
const path = require('path');
const EmailController = require('../mail/controller/mailer.controller');
const bodyHtml = fs.readFileSync(path.join(__dirname, '../mail/html/mail.html'), 'utf-8');

const authServices = new AuthController;
const userServices = new UserController;
const mailerServices = new EmailController;

router.post('/login',
    validatorHandler(login, 'body'),
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            const token = authServices.sigInToken(user.user ? user.user : user);
            const statusCode = user.statusCode ? user.statusCode : 200;
            res.status(statusCode).json({
                status: "success",
                message: user.message ? user.message : "User logged in successfully!",
                data: user.user ? user.user : user,
                token
            })
        } catch (error) {
            next(error);
        }
    }
);

router.post('/recovery',
    validatorHandler(recovery, 'body'),
    async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await authServices.readByEmail(email);
            if (!user) {
                throw boom.unauthorized('error');
            }
            await userServices.update(user.dataValues.id, { status: false });
            
            var token = authServices.recoveryToken(user.dataValues);
            var url = configuration.recoveryView;
            console.log(url);

            var html = bodyHtml.replace('{{message}}', 'Bienvenido a pets, podrás reestablecer tu contraseña personal haciendo click en el boton:');
            html = html.replace('{{url}}', url);
            html = html.replace('{{token}}', token);
            html = html.replace('{{alert}}', 'Ten en cuenta que este enlace solo dura 2 horas, luego de eso tendrás que solicitar uno nuevo');

            const result = await mailerServices.sendMail(user.dataValues, 'Reestablecer contraseña', html);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
);


router.post('/recovery-password',
    validatorHandler(changePassword, 'body'),
    async (req, res, next) => {
        passport.authenticate('recoveryPassword', { session: false }, async (err, user) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    throw boom.unauthorized('unauthorized, check your email');
                }
                const userStatus = await userServices.getById(user.sub);

                if (userStatus.status === true) {
                    throw boom.conflict('The token is already used');
                }

                const { password, oldPasword } = req.body;
                const userUpdate = await authServices.changePassword( user, oldPasword, password,);
                delete userUpdate.dataValues.password;
                res.status(202).json({
                    status: 202,
                    message: 'Password updated',
                    user: userUpdate
                });
            } catch (error) {
                next(error);
            }
        })(req, res, next);
    }
);

router.get('/refresh-token', (req, res) => {
    
});

module.exports = router;