const asyncHandler = require('express-async-handler')

// @desc get current price of a crypto currency
// @route PUT /api/marketdata/getcryptoprice
// @access Private 
const getCurrentPrice = asyncHandler( async (req, response) => {
    var request = require('request');

    //http://localhost:9000/api/marketdata/getcryptoprice/btcgbp

    var url = `https://www.bitstamp.net/api/v2/ticker/${req.params.symbol}`;

    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
        if (err) {
        console.log('Error:', err);
        response.status(400).json({message: 'Error with price API'})
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
            response.status(400).json({message: 'Error with inputted parameter'})
        } else {
        // data is successfully parsed as a JSON object:
        response.status(200).json(data)
        }
    });
})


// @desc get price of all cryptos in the market
// @route PUT /api/marketdata/getcryptoprice
// @access Private 
const getMarketPrice = asyncHandler( async (req, response) => {
    var request = require('request');

    //http://localhost:9000/api/marketdata/getcryptoprice/btcgbp

    var url = `https://www.bitstamp.net/api/v2/ticker/%7Bcurrency_pair%7D/`;

    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
        if (err) {
        console.log('Error:', err);
        response.status(400).json({message: 'Error with price API'})
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
            response.status(400).json({message: 'Error with inputted parameter'})
        } else {
        response.status(200).json(data)
        }
    });
})

module.exports = {
    getCurrentPrice,
    getMarketPrice
}