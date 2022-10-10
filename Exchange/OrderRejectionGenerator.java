package Exchange;

public class OrderRejectionGenerator {

    public static OrderReject GenerateMarketOrderRejection(long orderID, RejectionMessage rejectionMessage){
        return new OrderReject(orderID, rejectionMessage);
    }

}
