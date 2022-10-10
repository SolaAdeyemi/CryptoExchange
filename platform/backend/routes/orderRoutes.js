const express = require('express')
const { getOpenOrders } = require('../controllers/openOrderController')
const router = express.Router()
const {
  addNewOrder, getBalance
} = require('../controllers/orderController')

const {cancelOpenOrder} = require('../controllers/openOrderController')

const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, addNewOrder).get(protect, getBalance)
router.route('/open').get(protect, getOpenOrders)
router.route('/open/cancel').post(protect, cancelOpenOrder)

module.exports = router
