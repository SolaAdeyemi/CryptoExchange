package Exchange.TradingInstrument;

import java.util.ArrayList;

public class TradingInstrumentController {

    //TODO - trading isntuments + database

    //database
    //instument name - string
    //instumentID number - long
    //instruemnt type - CRYPTO or STOCK


    public ArrayList<String> getAllCryptoInstruments(){
        //make a call to the database to get the list of instruments
        //TODO - make database call to get strings

        ArrayList<String> instruments = new ArrayList<>();
        instruments.add("BTC/GBP");
        instruments.add("ETH/GBP");

        return instruments;
    }

    public ArrayList<Integer> getAllCryptoInstrumentIDs(){
        //make a call to the database to get the list of instrument IDs

        ArrayList<Integer> instrumentIDs = new ArrayList<>();
        return instrumentIDs;
    }



    public void addInstrument(){
        //send to the database
    }

    public void removeInstrument() {
        //remove from the database
    }

}
