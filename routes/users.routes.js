const express = require('express');

//  * MIDDLEWARES

const {
  userExists,
  protectAccountOwner,
} = require('../middlewares/users.middlewares');

const { protectSession } = require('../middlewares/auth.middlewares');

const {
  createUserValidations,
  checkValidations,
} = require('../middlewares/validations.middlewares');



//  * CONTROLLERS

const {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
  checkToken,
  getUserProducts,
  getUserOrders,
  getUserOrderById,
} = require('../controllers/users.controller');

const router = express.Router();

router.post('/', createUserValidations, checkValidations, createUser); //R

router.post('/login', login); //R


router.use(protectSession);


router.get('/', getAllUsers); //R

router.get('/me', getUserProducts); 

router.get('/orders', getUserOrders);

router.get('/orders/:id', getUserOrderById);

router.get('/check-token', checkToken);

router
  .route('/:id')
  .get(userExists, getUserById)
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

module.exports = { usersRouter: router };