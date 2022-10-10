import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import GoalItem from '../../components/GoalItem'
import Spinner from '../../components/Spinner'
import { getBalance, reset } from '../../features/balance/balanceSlice'
import SummaryBox from '../../components/summaryBox/SummaryBox'

function MyPortfolio() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { balance, isLoading, isError, message } = useSelector(
    (state) => state.balance
  )

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    }

    dispatch(getBalance('BTC/GBP'))

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, isError, message, dispatch])

  if (isLoading) {
    return <Spinner />
  }

  console.log("--------")
  console.log(balance)
  console.log("--------")
  return (
    <>
      <section className='heading'>
        <h1>Welcome {user && user.name}</h1>
        <p>My Portfolio {balance.balance}</p>
      </section>

      <section className='content'>
        
      </section>
    </>
  )
}

export default MyPortfolio
