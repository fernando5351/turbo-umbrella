const validateSchema = require('../../middleware/validatorHandler');
const UserController = require('../controllers/user.controller');
const { create, update } = require('../schemas/user.schema');
const { params, query } = require('../schemas/validator');
const router = require('express').Router();

const service = new UserController;

//register endpoint
router.post( '/register',
    validateSchema(create, 'body'),
    async (req, res, next) => {
        try {
            const user = await service.create(req.body);
            res.status(201).json({
                statusCode: 201,
                message: 'User created successfully!',
                data: user
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
            const users = await service.getAll(sort, order, limit,offset);
            res.status(200).json({
                status: 200,
                message: "satisfactorily obtained resources",
                data: users
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
            const user = await service.getById(req.params.id);
            res.status(200).json({
                statusCode: 200,
                message: `Resource ${req.params.id} retrieved satisfactory`,
                data: user
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
            const user = await service.update(req.params.id, req.body);
            res.status(200).json({
                statusCode: 200,
                message: 'Resource updated successfully',
                data: user
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
            const user = await service.delete(req.params.id);
            res.status(202).json({
                statusCode: 202,
                message:'The resource has been deleted',
                data: user
            })
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;