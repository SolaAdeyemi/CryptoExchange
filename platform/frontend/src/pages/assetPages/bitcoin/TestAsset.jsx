import React from 'react'
import { useEffect, useState } from 'react'

import Spinner from '../../../components/Spinner'

import axios from 'axios'

import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'



function TestAsset() {

  const [quote,setQuote] = useState('')

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { goals, isLoading, isError, message } = useSelector(
    (state) => state.goals
  )

  const getQuote = () =>{
    axios.get('https://api.quotable.io/random')
    .then(response => {
      //console.log(response)
      console.log(response.data.content)
      setQuote(response.data)
    }).catch(error => {
      console.log(error)
    })
  }



  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    }
    getQuote()

  }, [user, navigate, isError, message, dispatch])

  
  if (isLoading) {
    return <Spinner />
  }

  return (
    
    <>
      <section>
        <h1>test</h1>
        <button onClick={getQuote}> Get Quote </button>
        {quote ? <p>{quote.content}</p> : null}
      </section>


    </>
  )
}

export default TestAsset
