const {verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const CryptoJS = require('crypto-js');
const Product = require("../DB/models/Product");
const router = require("express").Router();


//create 
router.post('/', verifyTokenAndAdmin, async(req, res) => {
    const  newProduct = new Product(req.body)
    try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json( error)
    }
    
})


router.put("/:id", verifyTokenAndAuthorization,async (req, res) => {

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
            
        )
        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json(error)
    }
})

// //Delete the Product

router.delete("/:id", verifyTokenAndAuthorization, async (req,res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Product deleted successfully")
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get Product
router.get("/find/:id", async (req,res) => {
    try {
        const Product = await Product.findById(req.params.id)
        res.status(200).json(Product)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get all users

router.get("/", async (req,res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    
    try {
        let products;
       if(qNew){
        products = await Product.find().sort({createdAt:-1}).limit(1);
       }else if(qCategory){
        products = await Product.find({categories:{      
        $in : [qCategory]}
        });
       }else{
        products = await Product.find()
       }
        
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error)
    }
})

 module.exports = router;