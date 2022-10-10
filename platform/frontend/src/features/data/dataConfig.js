export default function getHistoricalPriceData (symbol) {
  
  const url = `https://www.bitstamp.net/api/v2/ohlc/${symbol}/?limit=1000&step=86400`
  axios.get(url)
  .then(response => {
    setHistoricalPriceData(response.data.data['ohlc'])
  }).catch(error => {
    console.log(error)
  })
}

