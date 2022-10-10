package Exchange.orderbook;

import java.util.ArrayList;
import java.util.List;
//combine with other interfaces?
public interface IOrderbookController extends IOrderbookItem {

    public ArrayList<OrderbookItem> getAllAskOrders();
    public ArrayList<OrderbookItem> getAllBidOrders();

}
