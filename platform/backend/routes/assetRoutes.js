const express = require('express')
const router = express.Router()
const {
    getAsset,
    getAllAsset
} = require('../controllers/assetController')

const { protect } = require('../middleware/authMiddleware')

router.route('/balance').post(protect, getAsset)
router.route('/balance/all').get(protect, getAllAsset)

module.exports = router
