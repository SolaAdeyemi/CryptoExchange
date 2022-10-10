package Exchange.orderbook;

import Exchange.OrderSide;

//All orders on the same price will be on the same limit
//Bids descending, asks ascending
public class OrderLimit {
    private final long limitPrice;
    public OrderbookItem head;
    public OrderbookItem tail;

    public OrderLimit(long limitPrice) {
        this.limitPrice = limitPrice;
    }


    public boolean isEmpty(){
        return head == null && tail == null;
    }

    public OrderSide getOrderSide(){
        if(isEmpty()){
            return OrderSide.INVALID;
        }else{
            return head.getOrder().getOrderSide();
        }
    }

    public int getVolumeInLimit(){
        int orderVolumeInLimit = 0;

        OrderbookItem orderbookPointer = head;

        while(orderbookPointer != null){
            orderVolumeInLimit += orderbookPointer.getOrder().getCurrentQuantity();
            orderbookPointer = orderbookPointer.nextOrder;

        }
        return orderVolumeInLimit;
    }

    public long getLimitPrice(){
        return limitPrice;
    }
}



