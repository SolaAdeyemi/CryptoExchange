package Exchange.orderbook;

import Exchange.Order;
import Exchange.OrderSide;
import Exchange.OrderType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.PriorityQueue;

import static org.junit.jupiter.api.Assertions.*;

class OrderbookTest {

    private static Orderbook orderbook;
    private static Order newBIDOrderOne, newBIDOrderTwo, newBIDOrderThree, newBIDOrderFour, newASKOrderOne, newASKOrderTwo;

    @BeforeEach
    void setup() {
        System.out.println("Starting setup.......");

        PriorityQueue<String> outputMessages = new PriorityQueue<String>();

        orderbook = new Orderbook("BTC/USD", outputMessages);

        newBIDOrderOne = new Order("BTC/USD", 1, 1, "90210", OrderSide.BID, 2000, 10, OrderType.LIMIT,
                "2022/08/26-08:47:43");
        newBIDOrderTwo = new Order("BTC/USD", 2, 2, "90210", OrderSide.BID, 2000, 10, OrderType.LIMIT,
                "2022/08/26-08:47:45");

        newBIDOrderThree = new Order("BTC/USD", 3, 3, "90210", OrderSide.BID, 2000, 5, OrderType.LIMIT,
                "2022/08/26-08:47:45");

        newBIDOrderFour = new Order("BTC/USD", 4, 4, "90210", OrderSide.BID, 2000, 5, OrderType.LIMIT,
                "2022/08/26-08:46:45");


        newASKOrderOne = new Order("BTC/USD", 20, 20, "90210", OrderSide.ASK, 2000, 10, OrderType.LIMIT,
                "2022/08/26-08:47:46");
        newASKOrderTwo = new Order("BTC/USD", 21, 21, "90210", OrderSide.ASK, 2000, 10, OrderType.LIMIT,
                "2022/08/26-08:47:49");
    }


    @AfterEach
    void tearDown() {
        //buy order, price 2000, quantity- 10
        //(instrument, orderID, clientOrderID, clientID, orderSide, price, quantity, orderType, timestamp)
        System.out.println("Starting tear down.......");

    }

    @Test
    void addMultipleNewOrdersToOrderbookShouldPutOrdersIntoEntries() {
        orderbook.addOrderToBook(newBIDOrderOne);
        orderbook.addOrderToBook(newBIDOrderTwo);
        assertTrue(orderbook.hasOrder(newBIDOrderOne.getOrderID()));
        assertTrue(orderbook.hasOrder(newBIDOrderTwo.getOrderID()));
    }

    @Test
    void addNewOrderToOrderbookSizeShouldBeOne() {
        orderbook.addOrderToBook(newBIDOrderOne);
        assertEquals(orderbook.getNumberOfOrders(), 1);
    }

    @Test
    void addTwoNewOrdersToOrderbookSizeShouldBeTwo() {
        orderbook.addOrderToBook(newBIDOrderOne);
        orderbook.addOrderToBook(newASKOrderOne);
        assertEquals(orderbook.getNumberOfOrders(), 2);
    }

    @Test
    public void removeOrderFromBookAfterAddingOrderToEmptyBook() {
        orderbook.addOrderToBook(newBIDOrderOne);
        orderbook.removeOrderFromBook(newBIDOrderOne.getOrderID());
        assertFalse(orderbook.hasOrder(newBIDOrderOne.getOrderID()));
    }

    @Test
    public void removeOrderFromBookAfterAddingMultipleOrders() {
        orderbook.addOrderToBook(newBIDOrderOne);
        orderbook.removeOrderFromBook(newBIDOrderOne.getOrderID());
        assertFalse(orderbook.hasOrder(newBIDOrderOne.getOrderID()));
    }

    @Test
    public void removeOrderThatDoesNotExistFromOrderbookShouldBeFalse() {
        orderbook.addOrderToBook(newBIDOrderOne);
        assertFalse(orderbook.removeOrderFromBook(45775374));
    }

    @Test
    public void getOrderBookSizeWhenEmptyShouldBeZero() {
        assertEquals(orderbook.getNumberOfOrders(), 0);
    }

    @Test
    public void hasOrderShouldReturnTrueAfterAddingOneNewOrder() {
        orderbook.addOrderToBook(newBIDOrderOne);
        assertTrue(orderbook.hasOrder(newBIDOrderOne.getOrderID()));
    }

    @Test
    public void hasOrderShouldReturnFalseWhenOrderDoesNotExist() {
        orderbook.addOrderToBook(newBIDOrderOne);
        assertFalse(orderbook.hasOrder(5474345));
    }


    @Test
    public void addingOnlyOneBIDOrderToBookItShouldNotMatchAndBookSizeIsOne() {
        orderbook.addOrder(newBIDOrderOne);
        assertEquals(orderbook.getNumberOfOrders(), 1);
    }

    @Test
    public void addingTwoBIDOrdersToBookItShouldNotMatchAndBookSizeIsTwo() {
        orderbook.addOrder(newBIDOrderOne);
        orderbook.addOrder(newBIDOrderTwo);
        assertEquals(orderbook.getNumberOfOrders(), 2);
    }

    @Test
    public void addingTwoASKOrdersToBookItShouldNotMatchAndBookSizeIsTwo() {
        orderbook.addOrder(newASKOrderOne);
        orderbook.addOrder(newASKOrderTwo);
        assertEquals(orderbook.getNumberOfOrders(), 2);
    }

    @Test
    public void addingOnlyOneBIDAndASKOrderToBookItShouldMatchAndBookSizeIsZero() {
        orderbook.addOrder(newBIDOrderOne);
        orderbook.addOrder(newASKOrderOne);
        assertEquals(orderbook.getNumberOfOrders(), 0);
    }

    @Test
    public void addingwoBIDAndTwoASKOrderToBookItShouldMatchAndBookSizeIsOne() {
        orderbook.addOrder(newBIDOrderThree);
        orderbook.addOrder(newASKOrderOne);
        orderbook.addOrder(newBIDOrderFour);
        orderbook.addOrder(newASKOrderTwo);
        assertEquals(1, orderbook.getNumberOfOrders());

    }




}