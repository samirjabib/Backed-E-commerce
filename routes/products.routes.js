const express = require('express');

// * CONTROLLERS


const { //Products Controller
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct
 } = require('../controllers/products.controller')


const { //Category Controller
    createCategory,
    updateCategory,
    getAllCategories
} = require('../controllers/categories.controller');


//* MIDDLEWARES 

const { protectSession } = require('../middlewares/auth.middlewares')

const { checkValidations, createProductValidations } = require('../middlewares/validations.middlewares')

const { productExists , protectProductOwner } = require('../middlewares/products.middlewares')

 // * ROUTES

const router = express.Router();

router.get('/', getAllProducts)

router.get('/categories', getAllCategories);


router.get('/:id', productExists, getProductById);


router.use(protectSession);

router.post('/', createProductValidations, checkValidations, createProduct);

router.post('/categories', createCategory);

router.patch('/categories/:id', updateCategory);

router
  .use('/:id', productExists)
  .route('/:id')
  .patch(protectProductOwner, updateProduct)
  .delete(protectProductOwner, deleteProduct);

module.exports = { productsRouter: router };