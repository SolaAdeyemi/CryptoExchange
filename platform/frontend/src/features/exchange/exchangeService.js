import axios from 'axios'

const API_URL = '/api/marketdata/'

const URL_DOMAIN = 'http://localhost:9000'

//get crypto price
const getCryptoPrice = async (symbol) => {

  const url = URL_DOMAIN + API_URL + 'getcryptoprice/' + symbol

  const response = await axios.get(url)

  return response.data
}

const exchangeService = {
  getCryptoPrice
}

export default exchangeService
