const express = require('express')
const  {listAllProducts, placeOrder, myOrders, cancelOrder, addToCart, getCart, removeFromCart} = require('../controllers/buyerServices')
const auth = require('../middleware/auth.js');
const router = express.Router();

router.get('/shop',auth, listAllProducts);

router.get('/:buyerId/myOrders',auth, myOrders);
router.delete('/:buyerId/myOrders/:orderId',auth, cancelOrder);
router.post('/:buyerId/placeOrder/:productId',auth, placeOrder);

router.post('/:buyerId/addToCart/:productId', auth, addToCart);
router.get('/:buyerId/myCart', auth, getCart);
router.delete('/:buyerId/removeFromCart/:productId', auth, removeFromCart);

module.exports = router;
