import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import {
  getTotalBalance,
  getBalance,
  reset,
} from "../features/balance/balanceSlice";
import PortfolioAssetTable from "../components/portfolioAssetTable/PortfolioAssetTable";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { portfolio, isLoading, isError, message } = useSelector(
    (state) => state.portfolio
  );

  const [marketPrice, setMarketPrice] = useState([]);
  const [bitcoinPrice, setBitcoinPrice] = useState("");
  const [ethereumPrice, setEthereumPrice] = useState([]);

  const getPriceData = (symbol) => {
    const url = "http://localhost:9000/api/marketdata/getcryptoprice/" + symbol;
    axios
      .get(url)
      .then((response) => {
        if (symbol == "btcgbp") {
          setBitcoinPrice(response.data.last);
        } else {
          setEthereumPrice(response.data.last);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const processPortfolio = (data) => {
    let proccessedPortfolio = [];
    let index = 0;

    const openQuantity = data.open;
    const symbol = data.symbol;
    const quantityFilled = data.quantityFilled;

    console.log(openQuantity);
    console.log(symbol);
    console.log(quantityFilled);

    console.log(bitcoinPrice);
    let price = 0;
    if (symbol == "BTC/GBP") {
      price = parseFloat(bitcoinPrice);
    } else if (symbol == "ETH/GBP") {
      price = parseFloat(ethereumPrice);
    }
    console.log("price: " + price);

    let portfolioData = {
      open: openQuantity,
      quantityFilled: quantityFilled,
      price: price,
      value: price * quantityFilled,
      symbol: symbol,
    };
    console.log(portfolioData);
    proccessedPortfolio.push(portfolioData);

    console.log("process");
    console.log(proccessedPortfolio);
    return proccessedPortfolio;
  };

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
    }
    getPriceData("btcgbp");
    getPriceData("ethgbp");

    dispatch(getTotalBalance());
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  console.log("here");
  console.log(bitcoinPrice);

  const data = processPortfolio(portfolio);

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
      </section>

      <section>
        <PortfolioAssetTable data={data} dispatch={dispatch} />
      </section>
    </>
  );
}

export default Dashboard;
