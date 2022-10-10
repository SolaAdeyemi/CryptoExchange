const asyncHandler = require("express-async-handler");

const { parseAndSendToExchange } = require("../config/fixEngine");

const Order = require("../models/orderModel");
const OpenOrder = require("../models/openOrderModel");

const addNewOrder = asyncHandler(async (req, res) => {
  if (!req.body.side) {
    res.status(400);
    throw new Error("Please add an order side");
  }

  if (!req.body.quantity) {
    res.status(400);
    throw new Error("Please add a quantity");
  }

  if (!req.body.asset) {
    res.status(400);
    throw new Error("No asset type was added");
  }

  if (!req.body.price) {
    res.status(400);
    throw new Error("please adda a price limit");
  }

  const newOrderId = generateOrderId();

  const order = await Order.create({
    user: req.user.id,
    side: req.body.side,
    quantity: req.body.quantity,
    asset: req.body.asset,
    price: req.body.price,
    orderId: newOrderId,
  });

  const openOrder = await OpenOrder.create({
    user: req.user.id,
    order: order,
    quantity: req.body.quantity,
    symbol: req.body.asset,
  });

  parseAndSendToExchange(order);

  res.status(200).json(order);
});

function generateOrderId() {
  let id = "";
  for (i = 0; i < 12; ++i) {
    id += Math.floor(Math.random() * 10);
  }
  return parseFloat(id);
}

const getBalance = asyncHandler(async (req, res) => {
  const openOrders = await OpenOrder.find({ user: req.user.id });

  res.status(200).json(openOrders);
});

module.exports = {
  addNewOrder,
  getBalance,
};
