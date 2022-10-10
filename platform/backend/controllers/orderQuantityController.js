const Order = require('../models/orderModel')

async function updateOrderQuantity(response){

  const orderID = response.orderID
  const order = await Order.findOne({ orderId: orderID })

  const newQuantity = order.quantity - response.quantity;

  if(newQuantity < 1){
    Order.remove({ orderId: orderID })
  }else{
    const updatedOrder = await Order.findOneAndUpdate({ orderId: orderID },{quantity: newQuantity})
  }
  console.log("order quantity is updated")
}

module.exports = {updateOrderQuantity}