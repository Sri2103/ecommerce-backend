const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require('crypto-js');
const { response } = require("express");
const jwt = require('jsonwebtoken');
const PassPhrase = process.env.PASS_SEC

/**
 Register route
 */ 

router.post('/register', async(req, res) => {
 const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(req.body.password, PassPhrase).toString(),
 });
 try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
 } catch (error) {
    res.status(500).json({ error: error});
 }
});
router.post('/login', async(req, res) => {
   const body = req.body;
 try {
    const user = await User.findOne({
      username: body.username});
     const{password, ...others} = user._doc
     if(user){
      const hashedPassword = CryptoJS.AES.decrypt(user.password,PassPhrase);
      const decryptedPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      const accessToken =  jwt.sign({
         id:user._id,
         isAdmin: user.isAdmin,
      }, process.env.JWT_SEC,{expiresIn:"3d"})
      decryptedPassword !== body.password 
         ?  res.status(401).json("wrong password")
         :  res.status(200).json({...others,accessToken});
     }else{
      res.status(401).json("username does not exist");
     }
 } catch (error) {
    res.status(500).json(error);
 }
});
 module.exports = router;