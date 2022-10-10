import Exchange.Exchange;

public class main {

    private static final int EXCHANGE_PORT = 8000;

    public static void main(String[] args) {

        Exchange exchange = new Exchange(EXCHANGE_PORT);
        exchange.run();

//        String message = "8=Fix.4.2 9=0120 35=D 49=ClientID123 56=targetID123 52=2022/08/26-08:47:43 11=576 55=BTC/USD 54=1 38=100 40=2 44=21436";
        //OrderProcessor orderProcessor = new OrderProcessor();
        //orderProcessor.run();
    }

}
