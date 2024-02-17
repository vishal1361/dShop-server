const contract = require('../controllers/contract')
const ipfs = require('../services/ipfs')
const crypto = require('crypto');

module.exports.storeProduct = async(req, res) => {
    console.log("Storing product details...", req.body);
    const id = crypto.randomBytes(16).toString('hex');
    // const productDataToIPFS = {
    //     ...req.body, 
    //     images: req.body.
    // }
    const options = {
        pinataMetadata: {
            name: id,
            // keyvalues: {
            //     customKey: 'customValue',
            //     customKey2: 'customValue2'
            // }
        },
        pinataOptions: {
            cidVersion: 0
        }
    };

    try {

        const result = await ipfs.pinJSONToIPFS(req.body, options);

        const productId = id;
        const productHash = result.IpfsHash;
        const sellerId = req.body.sellerId;

        const status = await contract.storeProductInStorage(productId, sellerId, productHash);
        res.status(201).json({status: status});
    } catch(error) {
        res.status(500).json({message: error});
    }
} 

module.exports.removeProductByProductId = async(req, res) => {
    const {sellerId, productId} = req.params;

    try {
        await contract.removeProductFromStorage(productId, sellerId);
        res.status(200);
    } catch(error) {
        res.status(500).json({message: error});
    }
}

module.exports.getAllProductBySellerId = async (req, res) => {
    const {sellerId} = req.params;

    try {
        const products = await contract.getProductBySellerId(sellerId);
        res.status(200).json(products);
    } catch(error) {
        res.status(500).json({message: error});
    }
}

