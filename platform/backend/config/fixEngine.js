const { sendData } = require("./exchangeInterface");

const CLIENT_ID = 454920;
const EXCHANGE_ID = 90210;

function parseAndSendToExchange(orderData) {
  const FIXMessage = parseMessage(orderData);
  sendData(FIXMessage);
}

function parseMessage(orderData) {
  const message = `8=Fix.4.2 9=56 35=D 49=${CLIENT_ID} 56=${EXCHANGE_ID} 52=${new Date().getTime()} 11=${
    orderData.orderId
  } 55=${getSymbol(orderData.asset)} 54=${getSide(
    orderData.side
  )} 38=${parseFloat(orderData.quantity)} 40=2 44=${parseFloat(
    orderData.price
  )}`;
  return message;
}

function getSymbol(asset) {
  if ((asset = "bitcoin")) {
    return "BTC/GBP";
  } else if ((asset = "ethereum")) {
    return "ETH/GBP";
  }
}

function getSide(side) {
  if ((side = "BUY")) {
    return "1";
  } else if ((asset = "SELL")) {
    return "2";
  }
}

function cancelAndSendToExchange(orderId) {
  const FIXMessage = createCancelFixMessage(orderId);
  console.log("Fix message " + FIXMessage)
  sendData(FIXMessage);
}

function createCancelFixMessage(orderId) {
  const message = `8=Fix.4.2 9=56 35=F 49=${CLIENT_ID} 56=${EXCHANGE_ID} 52=${new Date().getTime()} 41=${orderId} 11=${orderId} 37=${orderId}`;
  return message;
}

module.exports = { parseAndSendToExchange, createCancelFixMessage, cancelAndSendToExchange };
