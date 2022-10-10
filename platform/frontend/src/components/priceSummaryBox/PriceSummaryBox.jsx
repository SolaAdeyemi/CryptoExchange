import "./priceSummaryBox.css"
import OrderForm from "../orderForm/OrderForm"

export default function PriceSummaryBox(props) {
  return (
    <div className ="SummaryBox">
      
          <div className="BoxItem">
            <div className="row">
              Bid:  {props.bid}
            </div>
            <div className="row">
              Ask:  {props.ask}
            </div>
            <div className="row">
             % Change :  {props.change} %
            </div>
            <div className="row">
              Volume:  {props.volume}
            </div>
          </div>
          
          <div className="BoxItem">
            <div className="row">
                  Total Value:  {props.value}
              </div>
            <div className="row">
                Quantity:  {props.quantity}
            </div>
          </div>
          
          <div className="formContainer">
            <OrderForm asset={'BTC/GBP'}/>
          </div>
          

          
    </div>
  )
}
