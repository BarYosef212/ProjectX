const Order = require("../models/Order");

exports.getOrders = async (userId) => {
  let orders;
  if (userId !== 0) {
    orders = await Order.find({ "user.userId": userId }) // חיפוש כל ההזמנות של המשתמש עם מזהה מסוים
      .populate({
        path: "user.userId",
        select: "firstName lastName", // שדות להחזרה ממודל המשתמש
      });
  } else {
    orders = await Order.find({}).populate({
      path: "items.product",
      select: "name primaryImage price", // שדות להחזרה ממודל המוצרים
    });
  }
  return orders;
};

exports.deleteOrder = async(id)=>{
  const result = await Order.deleteOne({_id:id});
  if(result.deletedCount === 1){
    return true;
  }
  else return false;
}


exports.updateOrder = async (id, data) => {
  const result = await Order.findByIdAndUpdate(id, data, { new: true });
  if(result) return result
  else return null
};