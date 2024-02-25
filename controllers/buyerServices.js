const {contract} = require('../controllers/contract')
const ipfs = require('../services/ipfs.js')
const crypto = require('crypto');

module.exports.listAllProducts = async(req, res)  => {
    try {
        var productList = await contract.listAllProducts();

        const productsForSale = productList.map(async ({ productId, sellerId, ipfsHash }) => {
            const resData = await ipfs.getJSONDataFromIPFS(ipfsHash);
            return { product: { ...resData, productId, sellerId } };
        });
          
        Promise.all(productsForSale).then((productsForSale) => {
        console.log("Formatted Sale Data: ", productsForSale);
        return res.status(200).json({productsForSale});
        });

    } catch(error) {
        return res.status(400).json({message: error});
    }
}

module.exports.placeOrder = async(req, res) => {
    const {buyerId, productId } = req.params;
    const {orderDetails} = req.body;

    try {
        const status = await contract.placeOrder({...orderDetails});
        return res.status(201).json({message: "order received."});
    } catch(error) {
        return res.status(409).json({message: error});
    }
    
}

module.exports.myOrders = async (req, res) => {
    const {buyerId} = req.params;

    try{
        const myOrders = await contract.myOrders(buyerId);
        return res.status(200).json(myOrders);
    } catch(error) {
        return res.status(400).json({message: error});
    }
}

module.exports.cancelOrder = async (req, res) => {
    const {buyerId, orderId} = req.params;
    const {reason} = req.body;

    try {
        const status = await contract.cancelOrder(orderId, reason);
        return res.status(200).json({message: "order canceled."});
    } catch(error) {
        return res.status(400).json({message: error});
    }
}

module.exports.getCart = async (req, res) => {
    const {buyerId} = req.params;
    if(buyerId == undefined) {
        return res.status(500).json({message: "Invalid payload received."});
    }
    try {

        const result = await contract.getCart(buyerId);
        console.log(result);
        const myCart = result.map(async (productId ) => {
            console.log(productId)
            const productData = await contract.getProductByProductId(productId);

            const resData = await ipfs.getJSONDataFromIPFS(productData.ipfsHash);
            return { product: { ...resData, productId } };
        });
          
        Promise.all(myCart).then((myCart) => {
        console.log("Formatted cart Data: ", myCart);
        return res.status(200).json({myCart});
        });

    } catch(error) {
        console.log(error.toStirng());
        return res.status(500).json({message: error});
    }
}

module.exports.addToCart = async (req, res) => {
    const {buyerId, productId} = req.params;
    if(productId == undefined) {
        return res.status(500).json({message: "Invalid payload received."});
    }
    try {
        const result = await contract.addToCart(buyerId, productId);
        return res.status(201).json({result});
    } catch(error) {
        console.log(error.toString());
        return res.status(500).json({message: error});
    }
}

module.exports.removeFromCart = async (req, res) => {
    const {buyerId, productId} = req.params;
    if(productId == undefined || buyerId == undefined) {
        return res.status(500).json({message: "Invalid payload received."});
    }
    try {
        const result = await contract.removeFromCart(buyerId, productId);
        return res.status(200).json({message: "Product removed from cart."});
    } catch (error) {
        console.log(error.toString());
        return res.status(500).json({message: error});
    }
}
