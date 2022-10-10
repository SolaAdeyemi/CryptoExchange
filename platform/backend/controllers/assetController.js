const asyncHandler = require("express-async-handler");
const axios = require("axios").default;

const Asset = require("../models/assetModel");
const OpenOrder = require("../models/openOrderModel");

const getAsset = asyncHandler(async (req, res) => {
  const asset = await Asset.findOne({
    user: req.user.id,
    symbol: req.body.symbol,
  });

  res.status(200).json(asset);
});

const getAllAsset = asyncHandler(async (req, res) => {
  const assetBtc = await Asset.findOne({
    user: req.user.id,
    symbol: "BTC/GBP",
  });

  const openBtc = await OpenOrder.find({
    user: req.user.id,
    symbol: "BTC/GBP",
  });

  const quantityFilled = assetBtc.balance;
  const quantityOpenBtc = getQuantity(openBtc);
  const quantityBtc = quantityFilled - quantityOpenBtc;

  res.status(200).json({
    symbol: "BTC/GBP",
    quantityFilled: quantityFilled,
    open: quantityOpenBtc,
    symbolUrl: "btcgbp",
  });
});

function getQuantity(data) {
  total = 0;
  for (let i = 0; i < data.length; i++) {
    total = total + data[i].quantity;
  }
  return total;
}

module.exports = {
  getAsset,
  getAllAsset,
};
