const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// * MODELS

const { User } = require('../models/user.model');
const { Order } = require('../models/order.model')




// * UTILS
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { Product } = require('../models/product.model');
const { Email } = require('../utils/email.util');

dotenv.config({ path: './config.env' });


// *Controlers

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });

  res.status(200).json({
    users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
    role,
  });

  // Remove password from response
  newUser.password = undefined;

  //send Email

  await new Email(email).sendWelcome(username)

  res.status(201).json({ newUser });
}); 

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    // Validate that user exists with given email
    const user = await User.findOne({
      where: { email, status: 'active' },
    });


  
    // Compare password with db
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Invalid credentials', 400));
    }
  
    // Generate JWT
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  
    user.password = undefined;
  
    res.status(200).json({ token, user });
});

const getUserById = catchAsync(async (req, res, next) => { 
  const { user } = req;

  res.status(200).json({
    user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name } = req.body;

  await user.update({ name });

  res.status(200).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => { 
  const { user } = req;

  await user.update({ status: 'deleted' }); // Soft DELETE

  res.status(200).json({
    status: 'success',
  });
});

const checkToken = catchAsync(async (req, res, next) => {


  res.status(200).json({ user: req.sessionUser });
});

const getUserProducts = catchAsync(async (req, res, next) => {

  const {sessionUser} = req;

  const products = await Product.findAll({
      where:{
        userId : sessionUser.id
      }
  })


  res.status(200).json({ status: 'success', products});
});

const getUserOrders = catchAsync(async (req, res, next) => { 

  const {sessionUser} =req;

  const orders = await Order.findAll({
      where:{
          userId: userActive.id,
      },
      
      include:[{   
          model: Cart, where:{status:"purchased", userId: sessionUser.id},
          attributes:["id"],
          include:[{
              model: ProductInCart, where:{status:"purchased"},attributes:["quantity"],
              include:[{
                  model:Product, attributes:["title","price"]
              }]
              

          }]
      }],
         
  })

 

  res.status(200).json({
      status:"succes",
      orders
  })


});

const getUserOrderById = catchAsync(async (req, res, next) => { 
  const { id } = req.params;

  const order = await Order.findOne({
    where:{
      id,
    },
    include:[{
      model:Cart, attributes:["id"],
      include:[{
        model:Product, attributes: ["title","price"]
      }]
    }]
  })
  res.status(200).json({
    status:"success",
    order
  })
});

module.exports = {
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
};