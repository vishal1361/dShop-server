const express = require('express')
const  {listAllProducts, placeOrder, myOrders, cancelOrder} = require('../controllers/buyerServices')
const auth = require('../middleware/auth.js');
const router = express.Router();

router.get('/:buyerId/listAll',auth, listAllProducts);
router.get('/:buyerId/myOrders',auth, myOrders);
router.delete('/:buyerId/myOrders/:orderId',auth, cancelOrder);
router.post('/:buyerId/:productId/placeOrder',auth, placeOrder);

module.exports = router;
