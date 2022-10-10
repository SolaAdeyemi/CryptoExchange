import axios from "axios";

const API_URL = "/api/asset/balance";

const getBalance = async (symbol, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const data = {
    symbol: symbol,
  };

  const url = "http://localhost:5000/api/asset/balance";

  const response = await axios.post(url, data, config);

  console.log(response.data.balance);

  return response.data;
};

const getTotalBalance = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const url = "http://localhost:5000/api/asset/balance/all";

  const response = await axios.get(url, config);

  console.log("btc quantity: " + response.data.bitcoinQuantity);

  return response.data;
};


const balanceService = {
  getBalance,
  getTotalBalance,
};

export default balanceService;
