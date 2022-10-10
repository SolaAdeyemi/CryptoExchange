import "./bitcoinPriceSummaryBox.css"
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function BitcoinPriceSummaryBox() {
  return (
    <div className ="SummaryBox">
      
          <div className="BoxItem">
            <span className="SummaryBoxTitle">Overall Portfolio Returns</span>

            <div className="BoxContents">
              <div className="AbsoluteNumber">$140</div>
              <div className="PctChange">+12.5% <KeyboardArrowUpIcon/> </div>
            </div>
          </div>
          
    </div>
  )
}