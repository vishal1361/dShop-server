const {contract} = require('../controllers/contract')
const bcrypt = require('bcrypt');
const { uuidV4 } = require('ethers');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports.signIn = async(req, res) => {
    console.log("Sign In request  body at server :", req.body);
    const {email, password, userType} = req.body;
    try {

        const existingUser = await contract.findUserByEmail(email);
        
        if(existingUser.id.length == 0) {
            return res.status(400).json({message: "User does not exisits!"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCorrect) {
            return res.status(400).json("Invalid Credentials!");
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser.id}, 'test', {expiresIn: '1h'});

        const result = {
            id: existingUser.id.toString(),
            name: existingUser.name,
            email: existingUser.email,
            account: existingUser.account.toString(),
            userType: (existingUser.userType.toString() == "2" ? "ADMIN" : existingUser.userType.toString() == "1" ? "SELLER" : "BUYER")
        };        

        res.status(200).json({result, token});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Something went wrong!'});
    }
}

module.exports.signUp = async(req, res) => {
    
    const { firstName, lastName, email, password, confirmPassword, account, userType} = req.body;
    try {
        const id = crypto.randomBytes(16).toString('hex');
        console.log(id)
        const name = firstName +" "+ lastName;
        console.log("Name : ", name, email);
        const existingUser = await contract.findUserByEmail(email);
        console.log("existing user : ", existingUser);

        if(existingUser.id.length != 0) {
            return res.status(400).json({message: "User already exisits!"});
        }

        if(password !== confirmPassword) {
            return res.status(400).json({message: "Passwords don't match!"});
        }
        
        const hashedpassword = await bcrypt.hash(password, 12);
        
        const status = await contract.addUser(id, name, email, hashedpassword, account, userType);
        
        console.log("User account status : ", status);
        
        const token = jwt.sign({email: email, id: id}, 'test', {expiresIn: '1h'});
        const result = {id, name, email, account, userType};

        return res.status(200).json({result, token});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Something went wrong!'});
    }
}