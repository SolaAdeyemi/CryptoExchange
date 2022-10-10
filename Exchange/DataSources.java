package Exchange;

import java.io.IOException;


public class DataSources {

    public static void main(String[] args) throws IOException {
        getCryptoPairsOrderbookData("hhh");
    }

    public static void getCryptoPairsOrderbookData(String currencyPair) throws IOException {


    }

}





/*
- put into a sortable dataa structure
- create a simple order book - read only?
load all data into this simple orderbook (only use for matching purposes)
-true/proper orderbook is sotred into a database
-this one stored in a different database which is wiped when I get new data?,
Needs to update as frequenty as the upto date realtime price
-Need to be able to handle errors


with dat first check to see if the price is suplicated? if so will need to clean i.e. multiple volumes at same price put tgether

 */