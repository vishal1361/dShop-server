const {ethers, JsonRpcProvider, AlchemyProvider} = require('ethers');

const API_KEY = process.env.ALCHEMY_API_KEY
const API_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.ACCOUNT_PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;



// const provider = new AlchemyProvider('sepolia', API_KEY);
// const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const provider = new JsonRpcProvider('http://127.0.0.1:8545/');
const signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

console.log(`Using account: ${signer.address}`);

const MARKET_ABI  = require("../abis/contractAbi.json");
module.exports.contract = new ethers.Contract(CONTRACT_ADDRESS, MARKET_ABI, signer);