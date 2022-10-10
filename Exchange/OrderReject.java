package Exchange;



public class OrderReject{

    private final RejectionMessage rejectionMessage;
    private final long orderID;

    public OrderReject(long orderID, RejectionMessage rejectionMessage) {
        this.orderID = orderID;
        this.rejectionMessage = rejectionMessage;
    }

    public RejectionMessage getRejectionMessage() {
        return rejectionMessage;
    }

    public long getOrderID() {
        return orderID;
    }


}
