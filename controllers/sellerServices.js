const {contract} = require('../controllers/contract')
const ipfs = require('../services/ipfs.js')
const crypto = require('crypto');

module.exports.storeProduct = async(req, res) => {
    console.log("Storing product details...", req.body);
    const id = crypto.randomBytes(16).toString('hex');
    const productId = id;
    const {sellerId} = req.body;
    
    const formattedProductData = {
        ...req.body,
        productImages: req.body.productImages.map((imageObject) => {
          return imageObject.thumbUrl;
        }),
      };

    const options = {
        pinataMetadata: {
            name: id,
        },
        pinataOptions: {
            cidVersion: 0
        }
    };

    try {
        const result = await ipfs.pinJSONToIPFS(formattedProductData, options);
        
        const productHash = result.IpfsHash.toString();
        
        console.log(productId, sellerId, productHash);
        const status = await contract.storeProductInStorage(productId, sellerId, productHash);
        res.status(201).json({status: status});
    } catch(error) {
        res.status(500).json({message: error.toString()});
    }
} 

module.exports.removeProductByProductId = async(req, res) => {
    const {sellerId, productId} = req.params;
    console.log(productId);
    try {
        // Removing product from ipfs
        const productInfo = await contract.getProductByProductId(productId);
        const ipfsHash = productInfo.ipfsHash;
        console.log("Hash to unpin : ",productInfo);

        const unpinStatus = await ipfs.unpinDataFromIPFS(ipfsHash);
        console.log(`Status from Ipfs : `, unpinStatus);

        const status = await contract.removeProductFromStorage(productId, sellerId);
        res.status(200).json(status);
    } catch(error) {
        res.status(500).json({message: error.toString()});
    }
}

module.exports.getAllProductBySellerId = async (req, res) => {
    const {sellerId} = req.params;

    try {
        const productList = await contract.getProductBySellerId(sellerId);

        // TODO: get product data from the ipfs
        const sellerProducts = productList.map(async ({ productId, sellerId, ipfsHash }) => {
            const resData = await ipfs.getJSONDataFromIPFS(ipfsHash);
            return { product: { ...resData, productId, sellerId } };
          });
          
          // If you want to wait for all the promises to resolve, you can use Promise.all
          Promise.all(sellerProducts).then((sellerProducts) => {
            console.log("Formatted Data: ", sellerProducts);
            return res.status(200).json({sellerProducts});
          });
    } catch(error) {
        return res.status(500).json({message: error.toString()});
    }
}

