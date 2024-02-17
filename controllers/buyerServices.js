const contract = require('../controllers/contract')

module.exports.listAllProducts = async(req, res)  => {
    const {buyerId} = req.params;
    
    try {
        var products = await contract.listAllProducts();
        res.status(200).json(products);
    } catch(error) {
        res.status(400).json({message: error});
    }
}

module.exports.placeOrder = async(req, res) => {
    const {buyerId, productId } = req.params;
    const {orderDetails} = req.body;

    try {
        const status = await contract.placeOrder({...orderDetails});
        res.status(201);
    } catch(error) {
        res.status(409).json({message: error});
    }
    
}

module.exports.myOrders = async (req, res) => {
    const {buyerId} = req.params;

    try{
        const myOrders = await contract.myOrders(buyerId);
        res.status(200).json(myOrders);
    } catch(error) {
        res.status(400).json({message: error});
    }
}

module.exports.cancelOrder = async (req, res) => {
    const {buyerId, orderId} = req.params;
    const {reason} = req.body;

    try {
        const status = await contract.cancelOrder(orderId, reason);
        res.status(200);
    } catch(error) {
        res.status(400).json({message: error});
    }
}
