const net = require("net");

const {
  updateOrderQuantity,
} = require("../controllers/orderQuantityController");
const { updateAssetBalance } = require("../controllers/assetBalanceController");

const port = 8000;

const client = new net.Socket();

client.on("data", async function (data) {
  console.log("Response recieved from Exchange");
  const utfData = data.toString("utf-8");
  console.log(`From Exchange : ${utfData}`);
  const response = processExchangeResponse(utfData);
  await updateOrderQuantity(response);
  await updateAssetBalance(response);
  console.log("processing is done");
});

function closeConnection() {
  client.on("close", function () {
    console.log("Server Connection Closed");
  });
}

client.on("error", function (error) {
  console.error(`Connection Error ${error}`);
});

function sendData(fixData) {
  client.write(fixData + " \n");
  console.log("data sent to Exchange: " + fixData);
}

function connectToExchange() {
  client.connect(port, function () {
    console.log("Connected");
  });
}

function processExchangeResponse(data) {
  const dataSegments = data.split(" ");

  var response = {};

  for (let i = 0; i < dataSegments.length; i++) {
    const segment = dataSegments[i];
    const keyValuePair = segment.split("=");

    if (keyValuePair[0] == "11") {
      response.clientOrderID = parseFloat(keyValuePair[1]);
    } else if (keyValuePair[0] == "17") {
      response.executionID = parseFloat(keyValuePair[1]);
    } else if (keyValuePair[0] == "37") {
      response.orderID = parseFloat(keyValuePair[1]);
    } else if (keyValuePair[0] == "54") {
      response.side = keyValuePair[1];
    } else if (keyValuePair[0] == "14") {
      response.quantity = parseFloat(keyValuePair[1]);
    } else if (keyValuePair[0] == "58") {
      response.costToFill = parseFloat(keyValuePair[1]);
    } else if (keyValuePair[0] == "31") {
      response.price = parseFloat(keyValuePair[1]);
    } else if (keyValuePair[0] == "55") {
      response.symbol = parseFloat(keyValuePair[1]);
    }
  }
  return response;
}
module.exports = { connectToExchange, sendData, closeConnection };
