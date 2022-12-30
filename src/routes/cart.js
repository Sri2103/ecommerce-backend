const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const CryptoJS = require('crypto-js');
const Cart = require("../DB/models/Cart");
const router = require("express").Router();


//create 
router.post('/', verifyToken, async(req, res) => {
    const  newCart = new Cart(req.body);
    try {
    const savedProduct = await newCart.save();
    res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json( error)
    }
    
})


router.put("/:id", verifyToken,async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
            
        )
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json(error)
    }
})

// //Delete the Product

router.delete("/:id", verifyToken, async (req,res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart deleted successfully")
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get user cart Cart
router.get("/find/:userId", async (req,res) => {
    try {
        const cart = await Cart.findOne({userId:req.params.userId});
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get all 

router.get("/", verifyTokenAndAdmin, async (req,res) => {
    
    try {
        const carts = await Cart.find() 
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error)
    }
})

 module.exports = router;