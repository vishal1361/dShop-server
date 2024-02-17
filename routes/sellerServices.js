const express = require('express')

const {storeProduct, removeProductByProductId, getAllProductBySellerId} = require( '../controllers/sellerServices')
const auth = require('../middleware/auth.js');
const router = express.Router();

router.post('/addProduct',auth, storeProduct);
router.get('/:sellerId/myProducts',auth, getAllProductBySellerId);
router.delete('/:sellerId/myProducts/:productId',auth, removeProductByProductId);

module.exports = router;
