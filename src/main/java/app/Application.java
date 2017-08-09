package app;

import app.notification.ItemNotificationDao;
import app.notification.NotificationController;
import app.util.Filters;
import app.util.Path;
import app.util.ViewUtil;
import spark.servlet.SparkApplication;

import static spark.Spark.*;
import static spark.debug.DebugScreen.enableDebugScreen;

public class Application implements SparkApplication {

    public static ItemNotificationDao itemNotificationDao;

    @Override
    public void init() {
        itemNotificationDao = new ItemNotificationDao();

        // Configure Spark
        port(8080);
        staticFiles.location("/public");
        staticFiles.expireTime(600L);
//        enableDebugScreen();

        // Set up before-filters (called before each get/post)
        before("*", Filters.addTrailingSlashes);
        before("*", Filters.handleLocaleChange);

        // Set up routes
        get(Path.Web.NOTIFICATIONS, NotificationController.getAll);
        get(Path.Web.UPDATE, NotificationController.updateAllNotification);
        get("*", ViewUtil.notFound);

        //Set up after-filters (called after each get/post)
        after("*", Filters.addGzipHeader);
    }
}
