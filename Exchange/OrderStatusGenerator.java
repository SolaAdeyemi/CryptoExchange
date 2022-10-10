package Exchange;

public class OrderStatusGenerator {

    //consider collapsing into one status?? or nah

    public static CancelOrderStatus GenerateCancelOrderStatus(CancelOrder cancelOrder){
        return new CancelOrderStatus();
    }

    public static OrderStatus GenerateNewMarketOrderStatus(Order newOrder){
        return new OrderStatus();
    }

    public static ModifyOrderStatus GenerateModifyMarketOrderStatus(ModifyOrder modifyOrder){
        return new ModifyOrderStatus();
    }
}
