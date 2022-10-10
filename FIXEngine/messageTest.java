package FIXEngine;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.HashMap;

import static FIXEngine.message.*;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

class messageTest {

    private static final String DELIMITER = " ";
    private static String[] headerArray = new String[3];

    @BeforeAll
    static void Setup(){

        headerArray[0] = "Fix.4.2";
        headerArray[1] = "ClientID123";
        headerArray[2] = "targetID123";
    }


    @Test
    void VerifyingHeaderArray(){
        String[] expectedResult = new String[3];

        expectedResult[0] = "Fix.4.2";
        expectedResult[1] = "ClientID123";
        expectedResult[2] = "targetID123";

        assertArrayEquals(expectedResult, generateHeaderArray("ClientID123","targetID123"));
        System.out.println("hiiiii");
    }

    @Test
    void NewOrderMessageChecksumShouldBeLengthOfMessage(){
        String newOrderMessage = generateNewOrder(headerArray, "order576", "BTC/USD", "1","2",100,21436);

        System.out.println(newOrderMessage);


        String[] keyValuePairs = newOrderMessage.split(DELIMITER);
        HashMap<String,String> map = convertFIXMessageToHashMap(newOrderMessage);

        int messageChecksumLength = Integer.parseInt(map.get("9"));
        System.out.println(map.get("8"));

        int actualMessageLength = newOrderMessage.length();
        System.out.println(actualMessageLength);//String is actually 123

        assertEquals(actualMessageLength, messageChecksumLength);

    }

    @Test
    void NewOrderMessageLongChecksumShouldBeLengthOfMessage(){

        headerArray[0] = "Fix.4.2";
        headerArray[1] = "ClientID123445345";
        headerArray[2] = "targetID123435435";

        String newOrderMessage = generateNewOrder(headerArray, "order576123", "BTC/USD123", "17","2555",1007860,2174367);

        System.out.println(newOrderMessage);


        String[] keyValuePairs = newOrderMessage.split(DELIMITER);
        HashMap<String,String> map = convertFIXMessageToHashMap(newOrderMessage);

        int messageChecksumLength = Integer.parseInt(map.get("9"));

        int actualMessageLength = newOrderMessage.length();
        System.out.println(actualMessageLength);//String is actually 123

        assertEquals(actualMessageLength, messageChecksumLength);

    }
    

}