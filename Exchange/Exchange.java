package Exchange;

import Exchange.TradingInstrument.TradingInstrumentController;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;


public class Exchange {

    //Every client gets a thread

    private TradingInstrumentController tic;
    private int port;

    public Exchange(int port){

        this.tic = new TradingInstrumentController();
        this.port = port;
    }

    public static void main(String[] args) {
        System.out.println("hhhh");
    }
    public void run(){
        System.out.println("running");
        try(ServerSocket serverSocket = new ServerSocket(port)){

            while(true){

                Socket socket = serverSocket.accept();
                ExchangeServer exchangeServer = new ExchangeServer(socket);
                exchangeServer.start();

                new ExchangeServer(serverSocket.accept()).start();
                //since accept() is in the loop it will create a new socket for each client
            }

        } catch (IOException e){
            System.out.println("Exchange server exception: " + e.getMessage());
        }
    }




}
