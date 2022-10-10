package Exchange;

//REMOVE: to delete an order remove the orderID

public class CancelOrder{

    private final long orderID;

    public CancelOrder(long orderID){
        this.orderID = orderID;
    }

    public long getOrderID() {
        return orderID;
    }
}
