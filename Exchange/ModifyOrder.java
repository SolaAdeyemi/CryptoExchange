package Exchange;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ModifyOrder {

    private final int updatedQuantity;
    private final long updatedPrice;
    private final OrderSide updatedOrderSide;

    private final String instrument;
    private final String clientID;
    private final long orderID;
    private final long clientOrderID;
    private final OrderType orderType;

    public ModifyOrder(String instrument, long orderID, long clientOrderID, String clientID, int quantity, long price,
                       OrderSide orderSide, OrderType orderType) {
        this.clientID = clientID;
        this.orderID = orderID;
        this.instrument = instrument;
        this.updatedQuantity = quantity;
        this.updatedPrice = price;
        this.updatedOrderSide = orderSide;
        this.clientOrderID = clientOrderID;
        this.orderType = orderType;
    }

    public CancelOrder cancelOrder() {
        return new CancelOrder(orderID);
    }

    public Order addNewOrder() {
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd-HH:mm:ss");
        LocalDateTime localDateTime = LocalDateTime.now();
        String timestamp = dateTimeFormatter.format(localDateTime);

        return new Order(instrument, orderID, clientOrderID, clientID, updatedOrderSide, updatedPrice, updatedQuantity, orderType, timestamp);
    }

    public int getUpdatedQuantity() {
        return updatedQuantity;
    }

    public long getUpdatedPrice() {
        return updatedPrice;
    }

    public OrderSide getUpdatedOrderSide() {
        return updatedOrderSide;
    }

    public String getInstrument() {
        return instrument;
    }

    public String getClientID() {
        return clientID;
    }

    public long getOrderID() {
        return orderID;
    }
}
