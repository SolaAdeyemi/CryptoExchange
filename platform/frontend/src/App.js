import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header'
import BitcoinAsset from './pages/assetPages/bitcoin/BitcoinAsset'
import TestAsset from './pages/assetPages/bitcoin/TestAsset'
import TestChartCopy from './components/assetChart/AssetChart'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import TradingDashboard from './pages/tradingDashboard/TradingDashboard'
import Container from '../src/pages/tradingDashboard/Container'
import MyPortfolio from './pages/myPortfolio/MyPortfolio'
import Transactions from './pages/transactions/Transactions'

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/trade' element={< TradingDashboard/>} />
            <Route path='/trade/btc/gbp' element={< BitcoinAsset/>} />
            <Route path='/trade/test' element={< TestAsset/>} />
            <Route path='/trade/chart' element={< TestChartCopy/>} />
            <Route path='/test' element={< Container/>} />
            <Route path='/portfolio' element={< MyPortfolio/>} />
            <Route path='/transactions' element={< Transactions/>} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  )
}

export default App
