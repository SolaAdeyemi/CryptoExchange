import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createOrder } from '../../features/orders/orderSlice'

function OrderForm(props) {
  const [quantity, setQuantity] = useState('')
  const [side, setSide] = useState('')
  const [price, setPrice] = useState('')

  const asset = props.asset
  
  const dispatch = useDispatch()

  const onSubmit = (e) => {
    e.preventDefault()

    dispatch(createOrder({ quantity,side,asset,price }))
    setQuantity('')
    setSide('')
    setPrice('')
  }

  function setBuySide() {
    setSide('BUY')
  }

  function setSellSide() {
    setSide('SELL')
  }

  return (
    <section className='form'>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='text'>Quantity</label>
          <input
            type='number'
            name='quantity'
            id='quantity'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='text'>Price</label>
          <input
            type='number'
            name='price'
            id='price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className='form-group'>
          <button onClick={setBuySide} className='btn btn-block' type='submit'>
            Buy
          </button>
          <button onClick={setSellSide} className='btn btn-block' type='submit'>
            Sell
          </button>
        </div>
      </form>
    </section>
  )
}

export default OrderForm
