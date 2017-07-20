package app.notification;

import com.google.common.collect.ImmutableList;

import java.util.Date;
import java.util.List;

/**
 * Created by IFV-DS1-TUYENVT on 11/07/2017.
 */
public class ItemNotificationDao {
    private final List<ItemNotification> listNotification = ImmutableList.of(new ItemNotification(1, "2", "2", "2", "2"));

    public Iterable<ItemNotification> getAllNotifications() {
        return listNotification;
    }

    public ItemNotification getBookByIsbn(String id) {
        return listNotification.stream().filter(b -> b.getId().equals(id)).findFirst().orElse(null);
    }
}
