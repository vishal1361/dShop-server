const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
// const fetch = require('node-fetch');
const pinataSDK = require('@pinata/sdk');
const { error } = require('console');
const https = require('https');
const pinata = new pinataSDK({ pinataJWTKey: `${process.env.PINATA_JWT}`});
require('dotenv').config();

const agent = new https.Agent({  
  rejectUnauthorized: false  
});

pinata.testAuthentication().then((result) => {
  console.log(result);
}).catch((err) => {
  console.log(err);
});

module.exports.unpinDataFromIPFS = (hash) => {
    pinata.unpin(hashToUnpin).then((result) => {
      console.log(result);
      return {info: result};
    }).catch((err) => {
        console.log(err);
        throw error("IPFS service failed to unpin data!");
    });
}

module.exports.pinJSONToIPFS = async(body, options) => {
  try {
    const result = await pinata.pinJSONToIPFS(body, options);
    return {IpfsHash: result.IpfsHash};
  } catch(error) {
    throw error("IPFS service failed to upload data!");
  }
}

module.exports.getJSONDataFromIPFS = async(IpfsHash) => {
  try {
    const res = await axios.get(`${process.env.PINATA_PUBLIC_GATEWAY}${IpfsHash}`, { httpsAgent: agent });
    // const resData = await res.json();
    console.log("Data from Ipfs: ", res.data);
    return res.data;
  } catch (error) {
      console.log(error);
  }
}