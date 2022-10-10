const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    side: {
      type: String,
      required: [true, 'Please add an order side'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please add an order quantity'],
    },
    asset: {
      type: String,
      required: [true, 'Please add an asset'],
    },
    price: {
      type: Number,
      required: [true, 'Please add an order price'],
    },
    orderId: {
      type: Number,
      required: [true, 'orderID was not added to order'],
    },
  },
  {
    timestamps: true,
  }
)



module.exports = mongoose.model('Order', orderSchema)
