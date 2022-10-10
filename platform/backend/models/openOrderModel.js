const mongoose = require('mongoose')

const openOrderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    quantity: {
      type: Number,
      required: [true, 'Error quantity was not added'],
    },
    symbol: {
      type: String,
      required: [true, 'Please add an asset'],
    },
  },
  {
    timestamps: true,
  }
)



module.exports = mongoose.model('OpenOrder', openOrderSchema)
