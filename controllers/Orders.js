const Order = require("../models/Order");
const orderServices = require("../services/Orders");
const errorMessage = "An error occured, please try again later";

exports.confirmOrder = async (req, res) => {
  const { data } = req.body;
  try {
    const newOrder = new Order(data);
    const orderDb = await newOrder.save();
    res.json({ message: "Order confirmed", orderId: orderDb._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: errorMessage });
  }
};

exports.getOrders = async (req, res) => {
  const x =await  getMonthlyOrderData();
  console.log(x);
  const { userId } = req.body;
  try {
    const orders = await orderServices.getOrders(userId);
    if (orders.length > 0) {
      res.json({
        orders: orders,
      });
    } else {
      res.status(404).json({
        message: `No orders found,<br><a href="/store" style="text-decoration:underline">Visit our store </a>and place your first order today!`,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: errorMessage });
  }
};

exports.deleteOrder = async(req,res)=>{
  const {orderId} = req.body;
  const deleted = await orderServices.deleteOrder(orderId);
  if(deleted){
    res.json({
      message:"Order deleted successfully"
    })
  }
  else{
    res.status(403).json({
      message:errorMessage,
    })
  }
}

exports.updateOrder = async(req,res)=>{
  const {orderId,updatedOrder}=req.body;
  console.log(orderId,updatedOrder)
  const result = await Order.findByIdAndUpdate(orderId, updatedOrder, { new: true });
  if (result){
    res.json({
      message:"Order updated successfully",
    })
  }
  else{
    res.status(403).json({
      message:errorMessage
    })
  }
}

async function getMonthlyOrderData() {
  const data = await Order.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by year and month
  ]);

  // Transform the data to a format suitable for D3.js
  return data.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    count: item.orderCount,
  }));
}

