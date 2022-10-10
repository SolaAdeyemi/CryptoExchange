package Exchange.orderbook;

import Exchange.CancelOrder;
import Exchange.Order;
import Exchange.ModifyOrder;

//write interfacr
public interface IOrderbookItem {

    public void addOrder(Order order);
    public void modifyOrder(ModifyOrder modifyOrder);
    public void cancelOrder(CancelOrder cancelOrder);

    //add cancel all orders?

}
