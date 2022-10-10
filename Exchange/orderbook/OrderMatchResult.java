package Exchange.orderbook;

import Exchange.OrderSide;

//Note: A seller(ASK) will be +ve cost, A buyer(BID) will be -ve cost

public class OrderMatchResult {

    private long orderID;
    private long clientOrderID;
    private long currentQuantity;
    private long currentCost;
    private final String clientID;
    private OrderSide orderSide;
    private Long executionPrice;

    public OrderMatchResult(long orderID, long clientOrderID, long currentQuantity, long currentCost, String clientID,
                            OrderSide orderSide, Long executionPrice) {
        this.orderID = orderID;
        this.clientOrderID = clientOrderID;
        this.currentQuantity = currentQuantity;
        this.currentCost = currentCost;
        this.clientID = clientID;
        this.orderSide = orderSide;
        this.executionPrice = executionPrice;
    }

    public long getCurrentQuantity() {
        return currentQuantity;
    }

    public void increaseCurrentQuantity(long currentQuantity) {
        this.currentQuantity += currentQuantity;
    }

    public long getCurrentCost() {
        return currentCost;
    }

    public void increaseCurrentCost(long currentCost) {
        this.currentCost += currentCost;
    }

    public void increaseCostAndQuantity(long cost, long quantity) {
        this.currentCost += (cost * quantity);
        this.currentQuantity += quantity;
    }

    public long getOrderID() {
        return orderID;
    }

    public long getClientOrderID() {
        return clientOrderID;
    }

    public String getClientID() {
        return clientID;
    }

    public OrderSide getOrderSide() {
        return orderSide;
    }

    public String getOrderSideAsString() {
        if (orderSide == OrderSide.BID) {
            return "1";
        }
        return "2";
    }

    public Long getExecutionPrice() {
        return executionPrice;
    }

    public void setExecutionPrice(Long executionPrice) {
        this.executionPrice = executionPrice;
    }
}
