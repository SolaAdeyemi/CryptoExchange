import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../../../components/Spinner'
import axios from 'axios'
import AssetChart from '../../../components/assetChart/AssetChart'
import OrderForm from '../../../components/orderForm/OrderForm'
import { getTotalBalance, getBalance, reset } from '../../../features/balance/balanceSlice'
import PriceSummaryBox from '../../../components/priceSummaryBox/PriceSummaryBox'

function BitcoinAsset() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { balance, isLoading, isError, message } = useSelector(
    (state) => state.balance
  )

  const ASSET_SYMBOL = "BTC/GBP"
  const ASSET_SYMBOL_URL = "btcgbp"


  const [priceData, setPriceData] = useState('');
  const [historicalPriceData, setHistoricalPriceData] = useState('');

  const API_URL = '/api/marketdata/'

  const URL_DOMAIN = 'http://localhost:9000'
  const symbol = 'btcgbp'

  const getPriceData = () =>{

    const url = URL_DOMAIN + API_URL + 'getcryptoprice/' + symbol
    axios.get(url)
    .then(response => {
      setPriceData(response.data)
    }).catch(error => {
      console.log(error)
    })
  }

  async function getHistoricalPriceData (symbol) {
  
    const url = `https://www.bitstamp.net/api/v2/ohlc/${symbol}/?limit=1000&step=86400`
    await axios.get(url)
    .then(response => {
      setHistoricalPriceData(response.data.data['ohlc'])
    }).catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    }
    getPriceData()
    


    dispatch(getBalance(ASSET_SYMBOL))


    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])


  if (isLoading) {
    return <Spinner />
  }


  

  return (
    <>
    <div>  
        <div>
          <h1>Bitcoin (BTC/GBP)</h1>
        </div>

        <div>
          <PriceSummaryBox bid={priceData.bid} 
          ask={priceData.ask} 
          volume={priceData.volume} 
          change={priceData.percent_change_24} 
          value={priceData.last * balance.balance} 
          quantity={balance.balance}/>
        
        </div>

        <div>
          
        </div>

    </div>
      
      <div className='crypto-chart-container'>
      </div>

    </>
  )
}

export default BitcoinAsset



// function parseData(data){
//   let proccesedData = []
//   for(let i = 0; i < data.length; i++){
    
    

//     let newFormat ={
//       close: parseFloat(data[i].close),
//       high: parseFloat(data[i].high),
//       low: parseFloat(data[i].low),
//       open: parseFloat(data[i].open),
//       timestamp: parseFloat(data[i].timestamp),
//       volume: parseFloat(data[i].volume),
//     }
//     proccesedData.push(newFormat)
//   }

  
//   return proccesedData;

// }