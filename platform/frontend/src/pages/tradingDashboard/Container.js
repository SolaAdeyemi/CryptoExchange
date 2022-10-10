import React from 'react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import GoalForm from '../../components/GoalForm'
import GoalItem from '../../components/GoalItem'
import Spinner from '../../components/Spinner'
import { getGoals, reset } from '../../features/goals/goalSlice'
import axios from 'axios'

import Toolbar from '../../components/assetTable/TestToolBar'



class Container extends React.Component{

  state = {
     data: []
  }

  componentDidMount(){
     this.getData()
  }

  getData = async () => {

   const url = 'http://localhost:9000/api/marketdata/getmarketprice'
   await axios.get(url)
   .then(response => {
     //setPriceData(response.data)
     this.setState({
      data: response.data
   })
     
   }).catch(error => {
     console.log(error)
   })

  }



  render(){
      return (
      <>
         <section className='heading'>
         <h1>Welcome </h1>
         <p>Trading Dashboard</p>
       </section>

      <div>
            <Toolbar data={this.state.data}/>
      </div>
      </>
     )
  }
}

export default Container