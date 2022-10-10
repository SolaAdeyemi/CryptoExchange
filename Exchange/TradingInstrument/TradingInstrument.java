package Exchange.TradingInstrument;

//TODO create currency pairs database
//TODO - add having a sepeareate base/quote tables into the databse, essentially we need the instruemnt IDs, in java, it is quicker to compare numbers/integers vs string objects

public class TradingInstrument {

    private String baseCurrency;
    private String quoteCurrency;
    private long instrumentID;

    public TradingInstrument(String baseCurrency, String quoteCurrency){
        this.baseCurrency = baseCurrency;
        this.quoteCurrency = quoteCurrency;
        this.instrumentID = instrumentID;
    }

//    public static long getInstrumentIDFromDB(String baseCurrency, String quoteCurrency){
//        //search daatabase and get the isntrument ID associated with it
//        long instrumentID = getFromdatabase();
//        return instrumentID;
//    }
//
//    private static void setup(){
//        ArrayList<>()
//    }
}
