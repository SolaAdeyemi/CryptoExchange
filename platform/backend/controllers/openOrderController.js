const asyncHandler = require("express-async-handler");
const { cancelAndSendToExchange } = require("../config/fixEngine");

const OpenOrder = require("../models/openOrderModel");
const Order = require("../models/orderModel");

const getOpenOrders = asyncHandler(async (req, res) => {
  const rawOpenOrders = await OpenOrder.find({ user: req.user.id });

  const openOrders = await processOpenOrders(rawOpenOrders);

  res.status(200).json(openOrders);
});

async function processOpenOrders(openOrders) {
  let processedOrders = [];
  for (let i = 0; i < openOrders.length; i++) {
    let openOrder = openOrders[i];

    let order = await Order.findOne({ _id: openOrder.order });

    let openOrderProcessed = {
      symbol: openOrder.symbol,
      quantity: openOrder.quantity,
      side: order.side,
      limitPrice: order.price,
      id: order._id,
    };
    processedOrders.push(openOrderProcessed);
  }
  console.log(processedOrders.length);
  return processedOrders;
}

const cancelOpenOrder = asyncHandler(async (req, res) => {
  const openOrders = await OpenOrder.findOneAndRemove({ order: req.body.id });

  console.log("inside");
  console.log(openOrders.order);

  cancelAndSendToExchange(openOrders.order);

  res.status(200).json(openOrders);
});

module.exports = {
  getOpenOrders,
  cancelOpenOrder,
};
