const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const pinataSDK = require('@pinata/sdk');
const { error } = require('console');
const pinata = new pinataSDK({ pinataJWTKey: `${process.env.PINATA_JWT}`});

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

module.exports.pinJSONToIPFS = (body, options) => {
  pinata.pinJSONToIPFS(body, options).then((result) => {
      console.log(result);
      return {ipfsResponse : result}
  }).catch((err) => {
      console.log(err);
      throw error("IPFS service failed to upload data!");
  });
}