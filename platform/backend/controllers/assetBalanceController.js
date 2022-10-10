const Asset = require("../models/assetModel");
const Order = require("../models/orderModel");

async function updateAssetBalance(response) {
  const orderID = response.orderID;
  const order = await Order.findOne({ orderId: orderID });

  const user = order.user;

  const symbol = response.symbol;

  const asset = await Asset.findOne({ user: user, symbol: symbol });

  const quantity = parseFloat(response.quantity);

  if (!asset) {
    const assetResponse = await Asset.create({
      user: user,
      symbol: symbol,
      balance: quantity,
    });

    console.log("New asset added quantity - asset balance has been updated");
    return;
  }

  let newBalance = asset.balance;

  console.log(typeof quantity);
  if (response.side == "1" || response.side == "BUY") {
    newBalance = newBalance + quantity;
  } else {
    newBalance = newBalance - quantity;
  }
  console.log(newBalance);

  await Asset.findOneAndUpdate(
    { user: user, symbol: symbol },
    { balance: newBalance }
  );

  console.log("asset balance has been updated");
}

module.exports = { updateAssetBalance };
