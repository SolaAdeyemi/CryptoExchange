package FIXEngine;

import Exchange.orderbook.OrderMatchResult;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Random;

public class message {

    private static final String DELIMITER = " ";
    private static final String FIX_VERSION = "FIX.4.2.";

    public static String[] generateHeaderArray(String senderCompID, String targetID){
        String[] header = new String[3];

        header[0] = "Fix.4.2";
        header[1] = senderCompID;
        header[2] = targetID;

        return header;
    }

    public static String generateHeader(String[] headerArray, String checkSum, String timestamp, String msgType){
        StringBuilder header = new StringBuilder();

        header.append("8=")
                .append(headerArray[0])
                .append(DELIMITER);

        header.append("9=")
                .append(checkSum)
                .append(DELIMITER);

        header.append("35=")
                .append(msgType)
                .append(DELIMITER);

        header.append("49=")
                .append(headerArray[1])
                .append(DELIMITER);

        header.append("56=")
                .append(headerArray[2])
                .append(DELIMITER);

        header.append("52=")
                .append(timestamp)
                .append(DELIMITER);

        return header.toString();
    }

    public static String generateNewOrder(String[] headerArray, String senderOrderID, String symbol, String orderSide, String orderType,
                                          int quantity, long price){

        //adding the current time of the order creation
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy/MM/dd-HH:mm:ss");
        LocalDateTime localDateTime = LocalDateTime.now();
        String timestamp = dateTimeFormatter.format(localDateTime);

        StringBuilder fullMessage = new StringBuilder();
        StringBuilder partialMessage = new StringBuilder();

        partialMessage.append("11=")
                .append(senderOrderID)
                .append(DELIMITER);

        partialMessage.append("55=")
                .append(symbol)
                .append(DELIMITER);

        partialMessage.append("54=")
                .append(orderSide)
                .append(DELIMITER);

        partialMessage.append("38=")
                .append(Integer.toString(quantity)) //TODO remove to string
                .append(DELIMITER);

        partialMessage.append("40=")
                .append(orderType)
                .append(DELIMITER);

        partialMessage.append("44=")
                .append(Long.toString(price));

        int headerLength = 3;

        for (String s : headerArray) {
            headerLength += s.length();
        }

        //43 = length of timestamp(22) + length of checksum(6) + message type(4) + spaces (11)
        int messageLength = partialMessage.length() + headerLength + 43;

        String checkSum = String.valueOf(messageLength);

        int zeroCount = 4 - checkSum.length();

        if(zeroCount > 0){
            //String format = "%0" + zeroCount + "d";
            checkSum = String.format("%04d",messageLength); //adding leading zeros - check sum needs to be 4 digits
        }

        String finalHeader = generateHeader(headerArray, checkSum, timestamp, "D");

        System.out.println("00000:  " + finalHeader.length());

        fullMessage.append(finalHeader);
        fullMessage.append(partialMessage);

        System.out.println("partial message: " + partialMessage.length());
        System.out.println("header length + 3: " + headerLength);
        System.out.println(43);

        return fullMessage.toString();
    }

    public static HashMap<String,String> convertFIXMessageToHashMap(String message){
        String[] keyValuePairs = message.split(DELIMITER);

        HashMap<String,String> map = new HashMap<>();

        for(String keyValuePair : keyValuePairs){
            String[] components = keyValuePair.split("=");
            if (map.containsKey(components[0])) {
                throw new IllegalArgumentException("There are multiple values with the same key");
            }
            System.out.println("length is: " + components.length);
            System.out.println(components[0]);
            System.out.println(components[1]);
            map.put(components[0], components[1]);
        }
        return map;
    }

    public static String parseResponseMessage(OrderMatchResult orderMatchResult) {
        StringBuilder sb = new StringBuilder();

        sb.append("8=")
                .append(FIX_VERSION)
                .append(DELIMITER);

        sb.append("35=8")
                .append(DELIMITER);

        sb.append("49=90210")
                .append(DELIMITER);

        sb.append("56=")
                .append("454920")
                .append(DELIMITER);

        sb.append("11=")
                .append(orderMatchResult.getClientOrderID())
                .append(DELIMITER);

        sb.append("37=")
                .append(orderMatchResult.getOrderID())
                .append(DELIMITER);

        sb.append("17=")
                .append(new Random().nextLong())
                .append(DELIMITER);

        sb.append("54=")
                .append(orderMatchResult.getOrderSideAsString())
                .append(DELIMITER);

        sb.append("14=")
                .append(orderMatchResult.getCurrentQuantity())
                .append(DELIMITER);

        sb.append("58=")
                .append(orderMatchResult.getCurrentCost())
                .append(DELIMITER);

        sb.append("31=")
                .append(orderMatchResult.getExecutionPrice());

        return sb.toString();
    }


}
