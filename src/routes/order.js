const {verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const CryptoJS = require('crypto-js');
const Order = require("../DB/models/Order");
const router = require("express").Router();


//create 
router.post('/', verifyToken, async(req, res) => {
    const  newOrder = new Order(req.body);
    try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
    } catch (error) {
        res.status(500).json( error)
    }
    
})

//Update 
router.put("/:id", verifyTokenAndAdmin ,async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
            
        )
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json(error)
    }
})

// //Delete the Product

router.delete("/:id", verifyToken, async (req,res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order deleted successfully")
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get user Order Order
router.get("/find/:userId",verifyTokenAndAuthorization, async (req,res) => {
    try {
        const Orders = await Order.find({userId:req.params.userId});
        res.status(200).json(Orders)
    } catch (error) {
        res.status(500).json(error)
    }
})

// Get all 

router.get("/", verifyTokenAndAdmin, async (req,res) => {
    
    try {
        const Orders = await Order.find() 
        res.status(200).json(Orders);
    } catch (error) {
        res.status(500).json(error)
    }
})

//Get Monthly income

router.get('/income', verifyTokenAndAdmin, async(req,res) => {
    const date = new Date();
    const productId = req.query.pid;
    
    const lastMonth = new Date(date.setMonth(date.getMonth()-1))
    const previousMonth = new Date(date.setMonth(lastMonth.getMonth()-1))
    try {
        const income = await Order.aggregate([
            {$match: {createdAt:{$gte: previousMonth},
            ...(productId &&{
                products:{$elemMatch:{productId}}
            } )
        
        }},
            {$project:{
                month:{$month: "$createdAt"},
                sales:"$amount"
            }},
            {$group:{
                _id:"$month",
                total:{$sum:"$sales"},
            }},    
        ]);
    res.status(200).json(income);
    } catch (error) {
        res.status(500).json(error)
    }
})

 module.exports = router;