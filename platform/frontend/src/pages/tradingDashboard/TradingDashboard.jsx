import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import GoalForm from '../../components/GoalForm'
import GoalItem from '../../components/GoalItem'
import Spinner from '../../components/Spinner'
import { getGoals, reset } from '../../features/goals/goalSlice'
import axios from 'axios'

//import AssetTable from '../../components/assetTable/AssetTable'
import Toolbar from '../../components/assetTable/TestToolBar'


export default function TradingDashboard() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    const { user } = useSelector((state) => state.auth)
    const { goals, isLoading, isError, message } = useSelector(
      (state) => state.goals
    )

    const [priceData, setPriceData] = useState('');

    const API_URL = '/api/marketdata/'
  
    const URL_DOMAIN = 'http://localhost:9000'
  
    const getPriceData = () => {
  
      const url = 'http://localhost:9000/api/marketdata/getmarketprice'
      axios.get(url)
      .then(response => {
        setPriceData(response.data)
        
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
      
      getPriceData()
  
      return () => {
        dispatch(reset())
      }
    }, [user, navigate, isError, message, dispatch])
  
    if (isLoading) {
      return <Spinner />
    }

    // const redirectPage = (path) =>{ 
    //   let newPath = `/trade/` + path; 
    //   navigate(path);
    // }
  
    // const rows = []
    
    //   rows.push(priceData[2])
    //   rows.push(priceData[18])
      //console.log(priceData)
 
      // Array.prototype.forEach.call(document.querySelectorAll('button'), function(q) {
      //   q.addEventListener('click', function() {

      //     const path = this.closest('tr').querySelector('th').textContent.trim();
      //     redirectPage(path)

      //   });
      // })

    // function loadTable(){
    //   return( 
    //   <TableContainer component={Paper}>
    //     <Table sx={{ minWidth: 650 }} aria-label="simple table">
    //       <TableHead>
    //         <TableRow>
    //           <TableCell>Asset</TableCell>
    //           <TableCell align="right">% change (24hrs)</TableCell>
    //           <TableCell align="right">Bid</TableCell>
    //           <TableCell align="right">Ask</TableCell>
    //           <TableCell align="right">Volume</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {rows.map((row) => (
    //           <TableRow
    //             key={row.pair}
    //             sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    //           >
    //             <TableCell component="th" scope="row">
    //               {row.pair} 
    //             </TableCell>
    //             <TableCell align="right">{row.percent_change_24}</TableCell>
    //             <TableCell align="right">{row.bid}</TableCell>
    //             <TableCell align="right">{row.ask}</TableCell>
    //             <TableCell align="right">{row.volume}</TableCell>
    //             <button >Trade</button>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>  
    //   )
    // }
    
    return (
      <>
        <section className='heading'>
          <h1>Welcome {user && user.name}</h1>
          <p>Trading Dashboard</p>
        </section>
        
        <section>
          <>
          <Toolbar data={priceData}/>
          </>
        </section>
      </>
    )
}
