const validateSchema = require('../../middleware/validatorHandler');
const RoleController = require('../controllers/role.controller');
const { create, update } = require('../schemas/role.schema');
const { params, query } = require('../schemas/validator');
const router = require('express').Router();

const service = new RoleController;

router.post( '/',
    validateSchema(create, 'body'),
    async (req, res, next) => {
        try {
            const role = await service.create(req.body);
            res.status(201).json({
                message: 'Role created successfully!',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get('/',
    validateSchema(query, 'qery'),
    async (req, res, next) => {
        try {
            const { sort, order, limit, offset } = req.query;
            const roles = await service.getAll( sort, order, limit,offset);
            res.status(200).json({
                status: 200,
                message: "satisfactorily obtained resources",
                data: roles
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get('/search',
    validateSchema(query, 'query'),
    async (req, res, next) => {
        try {
            const { name } = req.query;
            const roles = await service.searchByName(name);
            res.status(200).json({
                status: 200,
                message: "satisfactorily obtained resources",
                data: roles
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get('/:id', 
    validateSchema(params,'params'),
    async (req,res,next)=> {
        try {
            const role = await service.getById(req.params.id);
            res.status(200).json({
                statusCode: 200,
                message: `Resource ${req.params.id} retrieved satisfactory`,
                data: role
            })
        } catch (error) {
            next(error)
        }
    }
);

router.patch('/:id',
    validateSchema(params, 'params'),
    validateSchema(update, 'body'),
    async  (req, res, next) => {
        try {
            const role = await service.update(req.params.id, req.body);
            res.status(200).json({
                statusCode: 200,
                message: 'Resource updated successfully',
                data: role
            });
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id',
    validateSchema(params,'params'),
    async (req,res,next) => {
        try {
            const role = await service.delete(req.params.id);
            res.status(202).json({
                statusCode: 202,
                message:'The resource has been deleted',
                data: role
            })
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;