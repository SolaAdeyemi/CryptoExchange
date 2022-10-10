package Exchange;

import Exchange.orderbook.Orderbook;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.PriorityQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


//TODO - after adding in the server i need a messsgae queue use ideas from here SEE UR IN BOOKMARKS
//intially had the idea, but  used this forum to find better techonlogies and how to structure it?? or maybe not use resource?
public class ExchangeServer extends Thread {
    private Socket socket;
    private MessageProcessor messageProcessor;
    private HashMap<String, Orderbook> orderbooks;
    private PriorityQueue<String> outputMessages;

    public ExchangeServer(Socket socket) {
        this.socket = socket;
        this.outputMessages = new PriorityQueue<String>();
        this.messageProcessor = new MessageProcessor(outputMessages);
    }

    @Override
    public void run() {
        ExecutorService service = Executors.newSingleThreadExecutor();

        try {
            BufferedReader input = new BufferedReader(
                    new InputStreamReader(socket.getInputStream()));
            //PrintWriter output = new PrintWriter(socket.getOutputStream(), true);
            OutputStreamWriter output = new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8);

            while (true) {
                String messageFromClient = input.readLine();
                System.out.println("Message From client: " + messageFromClient);
                if (messageFromClient.equals("exit")) {
                    break;
                }
                messageFromClient = "8=Fix.4.2 9=56 35=D 49=454920 56=90210 52=1664955986211 11=168364563770 55=BTC/GBP 54=1 38=4 40=2 44=4";
                long start = System.currentTimeMillis();
                messageProcessor.processOrder(messageFromClient);
                System.out.println("end " + System.currentTimeMillis());
                System.out.println("procesd done" + outputMessages.size());
                long end = System.currentTimeMillis();
                long time = end - start;
                System.out.println("time " + time);
//                //putting threads to sleep
//                try{
//                    Thread.sleep(1000); //1 seconds
//                } catch(InterruptedException e) {
//                    System.out.println("Thread Interrupted");
//                }
                //output.println("ereTOP");

                while (!outputMessages.isEmpty()) {
                    System.out.println("outputMessages size: ");
                    String messageToOutput = outputMessages.poll();
                    System.out.println("Output Message : " + messageToOutput);
                    if (messageToOutput != null) {
                        output.write(messageToOutput);
                        output.flush();
                    }
                }

//                while (!outputMessages.isEmpty()) {
//                    //output.println(outputMessages.poll());
//                    output.write(outputMessages.poll());
//
//                    output.flush();
//                }
            }

        } catch (IOException e) {
            System.out.println("Exchange server error: " + e.getMessage());
        } finally {
            try {
                socket.close();
            } catch (IOException e) {
                System.out.println("Exchange server error(IOException): " + e.getMessage());
            }
        }
    }

    public PriorityQueue<String> getOutputMessageQueue() {
        return outputMessages;
    }

    public void addToOutput(String message) {
        outputMessages.add(message);
    }
}
