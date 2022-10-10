package Exchange.orderbook;

import Exchange.CancelOrder;
import Exchange.ModifyOrder;
import Exchange.Order;
import Exchange.OrderSide;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.PriorityQueue;
import java.util.TreeSet;

import static FIXEngine.message.parseResponseMessage;


public class Orderbook implements IOrderbookController {

    private String tradingInstrument;
    private TreeSet<OrderLimit> asks = new TreeSet<OrderLimit>(LimitComparator.askComparator());
    private TreeSet<OrderLimit> bids = new TreeSet<OrderLimit>(LimitComparator.bidComparator());
    private HashMap<Long, OrderbookItem> orderbookEntries = new HashMap<>(); // direct access to everyorder, allows us to remove an order if we have the id
    private long SENSITIVITY = 10;
    private PriorityQueue<String> outputMessages;
    //add to report!!! allows us to add and remove in O(1) time


    public Orderbook(String tradingInstrument, PriorityQueue<String> outputMessages) {
        this.tradingInstrument = tradingInstrument;
        this.outputMessages = outputMessages;
    }

    @Override
    public ArrayList<OrderbookItem> getAllAskOrders() {
        ArrayList<OrderbookItem> askOrders = new ArrayList<>();

        for (OrderLimit orderLimit : asks) {
            if (orderLimit.head == null) continue;
            OrderbookItem currentOrder = orderLimit.head;
            while (currentOrder != null) {
                askOrders.add(currentOrder);
                currentOrder = currentOrder.nextOrder;
            }
        }
        return askOrders;
    }

    @Override
    public ArrayList<OrderbookItem> getAllBidOrders() {
        ArrayList<OrderbookItem> bidOrders = new ArrayList<>();

        for (OrderLimit orderLimit : bids) {
            if (orderLimit.head == null) continue;
            OrderbookItem currentOrder = orderLimit.head;
            while (currentOrder != null) {
                bidOrders.add(currentOrder);
                currentOrder = currentOrder.nextOrder;
            }
        }
        return bidOrders;
    }

    @Override
    public void addOrder(Order order) {
        System.out.println("order added to orderbook");
        OrderMatchResult matchResult = match(order);
        System.out.println("After adding order Reponse: ");

        if (matchResult.getCurrentQuantity() > 0) {
            sendToClient(matchResult);
        } else {
            System.out.println("No response string");
        }


    }

    @Override //When indivudals modify the order, their updated order will be placed at the ned of the orderbook
    public void modifyOrder(ModifyOrder modifyOrder) {
        if (orderbookEntries.containsKey(modifyOrder.getOrderID())) {
            cancelOrder(modifyOrder.cancelOrder());

            Order order = modifyOrder.addNewOrder();
            OrderLimit currentLimit = orderbookEntries.get(modifyOrder.getOrderID()).getLimit();
            addOrderToBook(order);
        }
    }

    @Override
    public void cancelOrder(CancelOrder cancelOrder) {
        if (orderbookEntries.containsKey(cancelOrder.getOrderID())) {
            removeOrderFromBook(cancelOrder.getOrderID());
        }
    }

    public ArrayList<Order> getAllOrders() {
        System.out.println("Orders in the orderbook---------------------------------");
        ArrayList<Order> orders = new ArrayList();
        for (Long orderID : orderbookEntries.keySet()) {
            OrderbookItem item = orderbookEntries.get(orderID);
            Order order = item.getOrder();
            System.out.println("ClientOrderID: " + order.getClientOrderID() + " Quantity: " + order.getCurrentQuantity()
                    + " Price: " + " Side: " + order.getOrderSide() + " Price: " + order.getPrice());
            orders.add(order);
        }
        return orders;
    }

    public Long getBestAsk() {
        if (asks.isEmpty()) return null;
        return asks.first().getLimitPrice();
    }

    public Long getBestBid() {
        if (bids.isEmpty()) return null;
        return bids.first().getLimitPrice();
    }

    public int getNumberOfOrders() {
        return orderbookEntries.size();
    }

    public boolean hasOrder(long orderID) {
        return orderbookEntries.containsKey(orderID);
    }

    public void addOrderToBook(Order order) {

        System.out.println("Adding Order: " + order.getClientOrderID());

        OrderLimit orderLimit = new OrderLimit(order.getPrice());
        OrderbookItem newOrderbookItem = new OrderbookItem(order, orderLimit);
        TreeSet<OrderLimit> orderSideLimitLevels = getOrderbookForSide(order);//bid or ask TreeSet

        if (!orderSideLimitLevels.contains(orderLimit)) {
            orderSideLimitLevels.add(orderLimit);

            orderLimit.tail = newOrderbookItem;
            orderLimit.head = newOrderbookItem;
        } else {
            if (orderLimit.head == null) {
                orderLimit.head = newOrderbookItem;
                orderLimit.tail = newOrderbookItem;
            } else {
                //Adding new order to the end of the LinkedList for the current limit
                OrderbookItem currentTail = orderLimit.tail;
                currentTail.nextOrder = newOrderbookItem;
                newOrderbookItem.prevOrder = currentTail;
                orderLimit.tail = newOrderbookItem;
            }
        }
        orderbookEntries.put(order.getOrderID(), newOrderbookItem);
    }

    public boolean removeOrderFromBook(long orderIDToRemove) {

        if (!hasOrder(orderIDToRemove)) {
            return false;
        }

        System.out.println(hasOrder(orderIDToRemove));

        OrderbookItem orderToRemove = orderbookEntries.get(orderIDToRemove);
        OrderLimit currentLimit = orderToRemove.getLimit();

        OrderbookItem prevOrderItem = orderToRemove.prevOrder;
        OrderbookItem nextOrderItem = orderToRemove.nextOrder;

        if (nextOrderItem != null && prevOrderItem != null) {
            prevOrderItem.nextOrder = nextOrderItem;
            nextOrderItem.prevOrder = prevOrderItem;
        } else if (prevOrderItem != null) {//At tail
            prevOrderItem.nextOrder = null;
            currentLimit.tail = prevOrderItem;
        } else if (nextOrderItem != null) {//At head
            nextOrderItem.prevOrder = null;
            currentLimit.head = nextOrderItem;
        }
        orderbookEntries.remove(orderIDToRemove);

        System.out.println("Removing Order: " + orderIDToRemove);

        return true;
    }

    public OrderbookItem getNextOrderbookItem(TreeSet<OrderLimit> orders) {
        for (OrderLimit orderLimit : orders) {
            if (orderLimit.head == null) continue;
            OrderbookItem currentOrderbookItem = orderLimit.head;

            return currentOrderbookItem;
        }
        return null;
    }

    private TreeSet<OrderLimit> getOrderbookForSide(Order order) {
        if (order.getOrderSide() == OrderSide.BID) {
            return bids;
        } else if (order.getOrderSide() == OrderSide.ASK) {
            return asks;
        } else {
            throw new IllegalArgumentException("Order being added into the orderbook has an INVALID side");
        }
    }

    private OrderMatchResult match(Order order) {//TODO - maybe change to full orders not partial? , maybe remove partially field orders then add to the end? if it is problematic
        //TODO - break up the lines
        if (order.getOrderSide() == OrderSide.BID) {
            OrderbookItem currentOrderbookItem = getNextOrderbookItem(asks);

            OrderMatchResult matchResult = new OrderMatchResult(order.getOrderID(), order.getClientOrderID(),
                    0, 0, order.getClientID(), OrderSide.BID, 0L);

            if (currentOrderbookItem == null || getNextOrderbookItem(asks) == null
                    || currentOrderbookItem.getOrder() == null) {
                addOrderToBook(order);
                System.out.println("triggered");
                return matchResult;
            }

            boolean matchIsPossible = true;

            while (order.getCurrentQuantity() > 0 && getNextOrderbookItem(asks) != null && matchIsPossible
                    && getNextOrderbookItem(asks).getOrder() != null) {
                long originalOrderQuantity = order.getCurrentQuantity();
                long originalOrderBookItemQuantity = getNextOrderbookItem(asks).getOrder().getCurrentQuantity();
                currentOrderbookItem = getNextOrderbookItem(asks);

                if (order.getPrice() >= currentOrderbookItem.getOrder().getPrice()) {

                    matchResult.increaseCostAndQuantity(currentOrderbookItem.getOrder().getPrice(),
                            Math.min(originalOrderBookItemQuantity, originalOrderQuantity));
                    order.decreaseOrderQuantity(currentOrderbookItem.getOrder().getCurrentQuantity());

                    if (originalOrderQuantity >= originalOrderBookItemQuantity) {//order in book is filled completely
                        removeOrderFromBook(currentOrderbookItem.getOrder().getOrderID());
                        OrderMatchResult matchResult2 = new OrderMatchResult(currentOrderbookItem.getOrder().getOrderID()
                                , currentOrderbookItem.getOrder().getClientOrderID(),
                                originalOrderBookItemQuantity, order.getPrice() * Math.min(originalOrderQuantity,
                                originalOrderBookItemQuantity),
                                currentOrderbookItem.getOrder().getClientID(),
                                currentOrderbookItem.getOrder().getOrderSide(), currentOrderbookItem.getOrder().getPrice());

                        sendToClient(matchResult2);
                    }
                    order.decreaseOrderQuantity(currentOrderbookItem.getOrder().getCurrentQuantity());
                    originalOrderQuantity = order.getCurrentQuantity();
                    originalOrderBookItemQuantity = getNextOrderbookItem(bids).getOrder().getCurrentQuantity();
                } else {
                    matchIsPossible = false;
                }
            }
            //If the current order was not completely filled, add it to the book
            if (order.getCurrentQuantity() > 0) {
                addOrderToBook(order);
            }
            sendToClient(matchResult);//TODO - sends result to the client, so that they can record the transaction as completed, withi
            return matchResult;
        } else {

            OrderbookItem currentOrderbookItem = getNextOrderbookItem(bids);

            OrderMatchResult matchResult = new OrderMatchResult(order.getOrderID(), order.getClientOrderID(),
                    0, 0, order.getClientID(), OrderSide.ASK, 0L);

            if (currentOrderbookItem == null || getNextOrderbookItem(bids) == null
                    || currentOrderbookItem.getOrder() == null) {
                addOrderToBook(order);
                return matchResult;
            }

            boolean matchIsPossible = true;

            long originalOrderQuantity = order.getCurrentQuantity();
            long originalOrderBookItemQuantity = getNextOrderbookItem(bids).getOrder().getCurrentQuantity();

            System.out.println("before after order quantity " + order.getCurrentQuantity() + "order ID " + order.getOrderID());

            while (order.getCurrentQuantity() > 0 && getNextOrderbookItem(bids) != null && matchIsPossible
                    && getNextOrderbookItem(bids).getOrder() != null) {

                currentOrderbookItem = getNextOrderbookItem(bids);

                if (order.getPrice() <= currentOrderbookItem.getOrder().getPrice()) {

                    matchResult.increaseCostAndQuantity(currentOrderbookItem.getOrder().getPrice(),
                            Math.min(originalOrderBookItemQuantity, originalOrderQuantity));

                    if (originalOrderQuantity >= originalOrderBookItemQuantity) {
                        removeOrderFromBook(currentOrderbookItem.getOrder().getOrderID());
                        OrderMatchResult matchResult2 = new OrderMatchResult(currentOrderbookItem.getOrder().getOrderID()
                                , currentOrderbookItem.getOrder().getClientOrderID(),
                                originalOrderBookItemQuantity,
                                order.getPrice() * Math.min(order.getCurrentQuantity(),
                                        currentOrderbookItem.getOrder().getCurrentQuantity()),
                                currentOrderbookItem.getOrder().getClientID(),
                                currentOrderbookItem.getOrder().getOrderSide(), currentOrderbookItem.getOrder().getPrice());
                        sendToClient(matchResult2);

                    }
                    order.decreaseOrderQuantity(currentOrderbookItem.getOrder().getCurrentQuantity());
                    originalOrderQuantity = order.getCurrentQuantity();
                    originalOrderBookItemQuantity = getNextOrderbookItem(bids).getOrder().getCurrentQuantity();
                } else {
                    matchIsPossible = false;
                }
            }
            System.out.println(" after order quantity " + order.getCurrentQuantity() + "order ID " + order.getOrderID());


            //If the current order was not completely filled, add it to the book
            if (order.getCurrentQuantity() > 0) {
                addOrderToBook(order);
            }
            System.out.println("left in book" + getNextOrderbookItem(bids).getOrder().getOrderID());
            sendToClient(matchResult);//TODO - sends result to the client, so that they can record the transaction as completed, within
            return matchResult;
        }
        //TODO - send to a table to show matches
    }

    public void sendToClient(OrderMatchResult orderMatchResult) {
        //String side = (orderMatchResult.getOrderSide() == OrderSide.BID) ? "BID" : "ASK";
        //String message = "Order Matched: clientOrderID: " + orderMatchResult.getClientOrderID() + " Quantity: " + orderMatchResult.getCurrentQuantity() + " Price: " + orderMatchResult.getCurrentCost() + " Side: " + side;
        String message = parseResponseMessage(orderMatchResult);
        System.out.println("Response To Client: " + message);
        outputMessages.add(message);
    }


}


/**
 * Data structure we will use is a treeset to sort linmits  ad the access times
 * <p>
 * In order to remove the order in O(1) time from the order book, or check if a specific order is in the orderbook
 * I will use a hashmap key: orderId(long) value: orderbOokitem
 */

//private OrderMatchResult match(Order order) {//TODO - change quantity to decimal to make it easier??? also debug asks + create tests
//
//    if (order.getOrderSide() == OrderSide.BID) {
//        OrderbookItem currentOrderbookItem = getNextOrderbookItem(asks);
//
//        OrderMatchResult matchResult = new OrderMatchResult(order.getOrderID(), order.getClientOrderID(),
//                0, 0, order.getClientID(), OrderSide.BID, 0L);
//
//        if (currentOrderbookItem == null || getNextOrderbookItem(asks) == null
//                || currentOrderbookItem.getOrder() == null) {
//            addOrderToBook(order);
//            System.out.println("triggered");
//            return matchResult;
//        }
//
//        boolean matchIsPossible = true;
//
//        while (order.getCurrentQuantity() > 0 && getNextOrderbookItem(asks) != null && matchIsPossible
//                && getNextOrderbookItem(asks).getOrder() != null) {
//            long originalOrderQuantity = order.getCurrentQuantity();
//            long originalOrderBookItemQuantity = getNextOrderbookItem(asks).getOrder().getCurrentQuantity();
//            currentOrderbookItem = getNextOrderbookItem(asks);
//
//            if (order.getPrice() >= currentOrderbookItem.getOrder().getPrice()) {
//
//                matchResult.increaseCostAndQuantity(currentOrderbookItem.getOrder().getPrice(),
//                        Math.min(originalOrderBookItemQuantity, originalOrderQuantity));
//                order.decreaseOrderQuantity(currentOrderbookItem.getOrder().getCurrentQuantity());
//
//                if (originalOrderQuantity >= originalOrderBookItemQuantity) {//order in book is filled completely
//                    removeOrderFromBook(currentOrderbookItem.getOrder().getOrderID());
//                    OrderMatchResult matchResult2 = new OrderMatchResult(currentOrderbookItem.getOrder().getOrderID()
//                            , currentOrderbookItem.getOrder().getClientOrderID(),
//                            originalOrderBookItemQuantity, order.getPrice() * Math.min(originalOrderQuantity,
//                            originalOrderBookItemQuantity),
//                            currentOrderbookItem.getOrder().getClientID(),
//                            currentOrderbookItem.getOrder().getOrderSide(), currentOrderbookItem.getOrder().getPrice());
//
//                    sendToClient(matchResult2);
//                }
//                order.decreaseOrderQuantity(currentOrderbookItem.getOrder().getCurrentQuantity());
//                originalOrderQuantity = order.getCurrentQuantity();
//                originalOrderBookItemQuantity = getNextOrderbookItem(bids).getOrder().getCurrentQuantity();
//            } else {
//                matchIsPossible = false;
//            }
//        }
//        //If the current order was not completely filled, add it to the book
//        if (order.getCurrentQuantity() > 0) {
//            addOrderToBook(order);
//        }
//        sendToClient(matchResult);//TODO - sends result to the client, so that they can record the transaction as completed, withi
//        return matchResult;
//    } else {
//
//        OrderbookItem currentOrderbookItem = getNextOrderbookItem(bids);
//
//        OrderMatchResult matchResult = new OrderMatchResult(order.getOrderID(), order.getClientOrderID(),
//                0, 0, order.getClientID(), OrderSide.ASK, 0L);
//
//        if (currentOrderbookItem == null || getNextOrderbookItem(bids) == null
//                || currentOrderbookItem.getOrder() == null) {
//            addOrderToBook(order);
//            return matchResult;
//        }
//
//        boolean matchIsPossible = true;
//
//        long originalOrderQuantity = order.getCurrentQuantity();
//        long originalOrderBookItemQuantity = getNextOrderbookItem(bids).getOrder().getCurrentQuantity();
//
//        System.out.println("before after order quantity " + order.getCurrentQuantity() + "order ID " + order.getOrderID());
//
//        while (order.getCurrentQuantity() > 0 && getNextOrderbookItem(bids) != null && matchIsPossible
//                && getNextOrderbookItem(bids).getOrder() != null) {
//
//            currentOrderbookItem = getNextOrderbookItem(bids);
//
//            if (order.getPrice() <= currentOrderbookItem.getOrder().getPrice()) {
//
//                matchResult.increaseCostAndQuantity(currentOrderbookItem.getOrder().getPrice(),
//                        Math.min(originalOrderBookItemQuantity, originalOrderQuantity));
//
//                if (originalOrderQuantity >= originalOrderBookItemQuantity) {
//                    removeOrderFromBook(currentOrderbookItem.getOrder().getOrderID());
//                    OrderMatchResult matchResult2 = new OrderMatchResult(currentOrderbookItem.getOrder().getOrderID()
//                            , currentOrderbookItem.getOrder().getClientOrderID(),
//                            originalOrderBookItemQuantity,
//                            order.getPrice() * Math.min(order.getCurrentQuantity(),
//                                    currentOrderbookItem.getOrder().getCurrentQuantity()),
//                            currentOrderbookItem.getOrder().getClientID(),
//                            currentOrderbookItem.getOrder().getOrderSide(), currentOrderbookItem.getOrder().getPrice());
//                    sendToClient(matchResult2);
//
//                }
//                order.decreaseOrderQuantity(currentOrderbookItem.getOrder().getCurrentQuantity());
//                originalOrderQuantity = order.getCurrentQuantity();
//                originalOrderBookItemQuantity = getNextOrderbookItem(bids).getOrder().getCurrentQuantity();
//            } else {
//                matchIsPossible = false;
//            }
//        }
//        System.out.println(" after order quantity " + order.getCurrentQuantity() + "order ID " + order.getOrderID());
//
//
//        //If the current order was not completely filled, add it to the book
//        if (order.getCurrentQuantity() > 0) {
//            addOrderToBook(order);
//        }
//        System.out.println("left in book" + getNextOrderbookItem(bids).getOrder().getOrderID());
//        sendToClient(matchResult);//TODO - sends result to the client, so that they can record the transaction as completed, within
//        return matchResult;
//    }
//    //TODO - send to a table to show matches
//}