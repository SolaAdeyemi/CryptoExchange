package Exchange.orderbook;

import java.util.Comparator;

public class LimitComparator {

    public static Comparator<OrderLimit> bidComparator() {
        return (o1, o2) -> Long.compare(o1.getLimitPrice(), o2.getLimitPrice());
    }

    public static Comparator<OrderLimit> askComparator() {
        return (o1, o2) -> Long.compare(o2.getLimitPrice(), o1.getLimitPrice());
    }

}
