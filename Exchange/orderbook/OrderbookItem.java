package Exchange.orderbook;

import Exchange.Order;

import java.time.LocalDateTime;

public class OrderbookItem {



    private Order order;
    private OrderLimit limit; //change
    private LocalDateTime createdAt;
    private OrderLimit parent;
    public OrderbookItem nextOrder;
    public OrderbookItem prevOrder;

    public OrderbookItem(Order order, OrderLimit parent) {
        this.order = order;
        createdAt = LocalDateTime.now();
        this.parent = parent;

    }

    public OrderLimit getLimit(){
        return limit;
    }

    public Order getOrder() {
        return order;
    }

}
