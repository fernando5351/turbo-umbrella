const router = require('express').Router();
const skipAuthentication = require('../../middleware/auth.handler.js');
const roleRouter = require('./role.routes.js')
const rolePermissionRouter = require('./rolePermission.routes.js');
const userRouter = require('./user.routes.js');
const authRouter = require('./auth.routes.js');
const directionRouter = require('./direction.routes.js');
const ownerRouter  = require('./owner.routes.js');
const specieRouter = require('./specie.routes.js');
const petRouter = require('./pet.routes.js');
const departmentRouter = require('./department.routes.js');
const districtRouter = require('./district.routes.js');

function routesHandler(app) {
    app.use('/api/v1', skipAuthentication, router);
    router.use('/role/permissions', rolePermissionRouter);
    router.use('/role', roleRouter);
    router.use('/user', userRouter);
    router.use('/auth', authRouter);
    router.use('/direction', directionRouter);
    router.use('/owner',ownerRouter);
    router.use('/specie',specieRouter)
    router.use('/pet', petRouter);
    router.use('/department', departmentRouter);
    router.use('/district', districtRouter);
}

module.exports = routesHandler;