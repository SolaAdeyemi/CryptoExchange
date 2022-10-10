import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import GoalForm from "../../components/GoalForm";
import GoalItem from "../../components/GoalItem";
import Spinner from "../../components/Spinner";
import { getOpenOrders, reset } from "../../features/orders/orderSlice";
import axios from "axios";

//import AssetTable from '../../components/assetTable/AssetTable'
import Toolbar from "../../components/assetTable/TestToolBar";
import OpenOrderTable from "../../components/openOrderTable/OpenOrderTable";

export default function Transactions() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { openOrders, isLoading, isError, message } = useSelector(
    (state) => state.openOrders
  );

  console.log("in trans");
  console.log(isLoading);

  if (!isLoading) {
    console.log("not loaded");
  }
  console.log(openOrders);

  const [currOpenOrders, setCurrOpenOrders] = useState("");

  const API_URL = "/api/marketdata/";

  const URL_DOMAIN = "http://localhost:9000";

  const getPriceData = () => {
    const url = "http://localhost:5000/api/transactions/open";
    axios
      .get(url)
      .then((response) => {
        setCurrOpenOrders(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const processData = (data) => {
    let dataProcessed = [];
    //symbol: 'BTC/GBP', quantity: 9, side: 'BUY', limitPrice: 9, id: '6333b8318e511d27b180c927'
    for (let i = 0; i < data.length; i++) {
      dataProcessed.push(9);
    }
    return dataProcessed;
  };

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate("/login");
    }

    dispatch(getOpenOrders());

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  console.log("test");
  console.log(typeof openOrders);
  console.log(openOrders[4]);

  const testData = processData(openOrders);
  console.log("test data" + typeof testData);




 
  return (
    <>
      <section className="heading">
        <h1>Open Transactions</h1>
      </section>

      <section>
        <OpenOrderTable data={openOrders} dispatch={dispatch} />
      </section>
    </>
  );
}
