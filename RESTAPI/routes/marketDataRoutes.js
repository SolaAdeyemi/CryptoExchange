const express = require('express')
const router = express.Router()
const { getCurrentPrice, getMarketPrice } = require('../controllers/marketDataController')

router.get('/getcryptoprice/:symbol', getCurrentPrice);
router.get('/getmarketprice', getMarketPrice);

module.exports = router