package Exchange;

import Exchange.TradingInstrument.TradingInstrumentController;
import Exchange.orderbook.Orderbook;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.PriorityQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;

import static FIXEngine.message.convertFIXMessageToHashMap;

public class MessageProcessor {

    //TODO - change the queues into Java Messaging Services or add to improvement side

    private final ConcurrentHashMap<String, ConcurrentLinkedQueue<Order>> processingQueues;
    private ConcurrentLinkedQueue<Order> centralProcessingQueue;
    private TradingInstrumentController tic;
    private HashMap<String, Orderbook> orderbooks;
    private PriorityQueue<String> outputMessages;

    public MessageProcessor(PriorityQueue<String> outputMessages) {
        this.outputMessages = outputMessages;
        this.processingQueues = new ConcurrentHashMap<>();
        this.tic = new TradingInstrumentController();
        this.centralProcessingQueue = new ConcurrentLinkedQueue<Order>();
        this.orderbooks = new HashMap<>();
        setupOrderbooks(orderbooks);
        setupProcessingQueues();
    }

    public void run() {

        while (true) {
            if (!centralProcessingQueue.isEmpty()) {
                Order order = centralProcessingQueue.poll();

                String instrument = order.getInstrument();

                ConcurrentLinkedQueue<Order> queueForInstrument = processingQueues.get(instrument);

                queueForInstrument.add(order);

                System.out.println("Order: " + order.getOrderID() + " ,was added to the instrument queue");

                System.out.println("Test");
                System.out.println(queueForInstrument.size());
            }
        }
    }

    public void setupProcessingQueues(){

        ArrayList<String> instruments = tic.getAllCryptoInstruments();

        //creates a new queue for every trading instrument
        for(String instrument: instruments){
            ConcurrentLinkedQueue<Order> queueForInstrument = new ConcurrentLinkedQueue<Order>();
            processingQueues.put(instrument, queueForInstrument);
        }
    }

    //Incoming orders are turned into Order objects and added to central queue
    public void processOrder(String fixMessage){
        System.out.println("In Process Order(), Message: " + fixMessage);

        HashMap<String,String> msg = convertFIXMessageToHashMap(fixMessage);

        //TODO verify that the tarhetID matches with oursm i.e. they meant to send it to us, create a test for it too
        //verify FIX type too
        //verify if request type is supported e.g. new order(D) is supportd but other might not be a

        //TODO - add radomiser for order
        if (msg.get("35").equals("D")) {
            Order order = new Order(msg.get("55"), Long.parseLong(msg.get("11")), Long.parseLong(msg.get("11")), msg.get("49"),
                    parseOrderSide(msg.get("54")), Long.parseLong(msg.get("44")), Integer.parseInt(msg.get("38")),
                    parseOrderType(msg.get("40")), msg.get("52"));
            //TODO - add to database, method should take in order object and add to the queue
            addOrderToCryptoQueue(order);
        } else if (msg.get("35").equals("F")) {
            Order order = new Order(msg.get("55"), Long.parseLong(msg.get("11")), Long.parseLong(msg.get("11")), msg.get("49"),
                    parseOrderSide(msg.get("54")), Long.parseLong(msg.get("44")), Integer.parseInt(msg.get("38")),
                    parseOrderType(msg.get("40")), msg.get("52"));
            cancelOrder(order);
        }
    }

    public HashMap<String, Orderbook> setupOrderbooks(HashMap<String, Orderbook> orderbooks) {
        ArrayList<String> instruments = tic.getAllCryptoInstruments();

        for (String tradingInstrument : instruments) {
            Orderbook newOrderbook = new Orderbook(tradingInstrument, outputMessages);
            orderbooks.put(tradingInstrument, newOrderbook);
        }
        return orderbooks;
    }

    private void addOrderToCryptoQueue(Order order) {
        System.out.println("order: " + order.getOrderID() + " added to crypto queue");
        ConcurrentLinkedQueue<Order> queueForCrypto = processingQueues.get(order.getInstrument());
        queueForCrypto.add(order);
        System.out.println("Order Added to crypto Queue");
        processQueue(queueForCrypto);
        System.out.println("Order removed from crypto Queue");
    }

    private void cancelOrder(Order order) {
        System.out.println("cancelling order: " + order.getOrderID());
        CancelOrder cancelOrder = new CancelOrder(order.getOrderID());
        Orderbook orderbook = orderbooks.get(order.getInstrument());
        orderbook.cancelOrder(cancelOrder);
    }

    private void processQueue(ConcurrentLinkedQueue<Order> queue) {
        while (!queue.isEmpty()) {
            Order order = queue.poll();
            Orderbook orderbook = orderbooks.get(order.getInstrument());
            orderbook.addOrder(order);
            System.out.println(orderbook.getNumberOfOrders());
        }
    }



























    public void addOrder(){



    }







    private OrderSide parseOrderSide(String orderSide){
        if(orderSide.equals("1")){
            return OrderSide.BID;
        }else{
            return OrderSide.ASK;
        }
    }

    private OrderType parseOrderType(String orderType){
        if(orderType.equals("1")){
            return OrderType.MARKET;
        }else{
            return OrderType.LIMIT;
        }
    }

}

/*
tests
-test to make sure the ocrrect order object is generated?
-test to make sure that if the targetID is wrong a rejection is returned
-verify fix typew too
 */
