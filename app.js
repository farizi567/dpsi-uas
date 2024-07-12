const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const cors = require('cors');
const { db } = require('./config'); // Require the config file
const app = express();
const router = express.Router();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*', // Updated origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
dotenv.config();

// All of my api here shit
const authController = require('./controllers/authcontroller');
const userController = require('./controllers/usercontroller');
const vegetableController = require('./controllers/vegetablecontroller');
const cartController = require('./controllers/cartcontroller');
const orderController = require('./controllers/ordercontroller');
const reviewController = require('./controllers/reviewcontroller');

const { authenticate, authorize } = require('./middleware/authmiddleware');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// User routes
router.get('/users', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/users/:id', authenticate, authorize(['admin', 'user']), userController.getUserById);
router.put('/users/:id', authenticate, authorize('admin'), userController.updateUser);
router.delete('/users/:id', authenticate, authorize('admin'), userController.deleteUser);

// Vegetable routes
router.get('/vegetables', authenticate, vegetableController.getAllVegetables);
router.get('/vegetables/:id', authenticate, vegetableController.getVegetableById);
router.post('/vegetables', authenticate, authorize('admin'), vegetableController.addVegetable);
router.put('/vegetables/:id', authenticate, authorize('admin'), vegetableController.updateVegetable);
router.delete('/vegetables/:id', authenticate, authorize('admin'), vegetableController.deleteVegetable);

// Cart routes
router.post('/cart', authenticate, cartController.addToCart);
router.put('/cart', authenticate, cartController.updateCart);
router.get('/cart/:userId', authenticate, cartController.getCart);

// Order routes
router.post('/order', authenticate, orderController.placeOrder);
router.get('/order/:id', authenticate, orderController.getOrderById);

// Review routes
router.post('/order/:id/review', authenticate, reviewController.submitReview);



const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Example route to demonstrate database connection
router.get('/test', async (req, res) => {
  try {
    const snapshot = await db.collection('testCollection').get();
    const data = snapshot.docs.map(doc => doc.data());
    res.json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.use('/api', router);