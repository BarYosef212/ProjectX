const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/Orders");
const { isLoggedIn, isAdmin,isLoggedOut } = require("../middleware/auth");

router.get("/completeOrder",isLoggedIn,(req,res)=>{
  res.render("completeOrder")
})

router.post("/confirmOrder",isLoggedIn,ordersController.confirmOrder)

router.get("/ordersUser",isLoggedIn,(req,res)=>{
  res.render("ordersUser")
})
router.post("/getOrders",isLoggedIn,ordersController.getOrders) 

router.get("/ordersUserAdmin",isAdmin,(req,res)=>{
  res.render('ordersUserAdmin')
})

router.get("/graphAdmin",isAdmin,(req,res)=>{
  res.render("graphAdmin")
})

router.get("/getMonthlyOrderData",isAdmin,ordersController.getMonthlyOrderData)

router.post("/deleteOrder",isAdmin,ordersController.deleteOrder)
router.post("/updateOrder",isAdmin,ordersController.updateOrder)


module.exports=router;