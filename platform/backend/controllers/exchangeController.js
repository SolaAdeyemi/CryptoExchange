import React from "react";

function getCryptoPrice(symbol) {
  var url = `http://localhost:9000/api/marketdata/getcryptoprice/${symbol}`;

  request.put(
    {
      url: url,
      json: true,
      headers: { "User-Agent": "request" },
    },
    (err, res, data) => {
      if (err) {
        console.log("Error:", err);
        response.status(400).json({ message: "Error with price API" });
      } else if (res.statusCode !== 200) {
        console.log("Status:", res.statusCode);
        response.status(400).json({ message: "Error with inputted parameter" });
      } else {
        response.status(200).json(data);
      }
    }
  );
}

module.exports = {
  getCryptoPrice,
};
