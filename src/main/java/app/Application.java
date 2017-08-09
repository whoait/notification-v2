package app;

import app.notification.ItemNotificationDao;
import app.notification.NotificationController;
import app.util.Filters;
import app.util.Path;
import app.util.ViewUtil;
import spark.servlet.SparkApplication;

import static spark.Spark.get;

import static spark.Spark.*;

public class Application implements SparkApplication {

    public static ItemNotificationDao itemNotificationDao;

    public void init() {


        // Configure Spark
        port(8081);
        staticFiles.location("/public");
        staticFiles.expireTime(600L);
//        enableDebugScreen();

        // Set up before-filters (called before each get/post)
        before("*", Filters.addTrailingSlashes);
        before("*", Filters.handleLocaleChange);

        itemNotificationDao = new ItemNotificationDao();
        // Set up routes
        get("/", (request, response) -> {
            return "Ok, Success";
        });
        get(Path.Web.NOTIFICATIONS, NotificationController.getAll);
        get(Path.Web.UPDATE, NotificationController.updateAllNotification);

        get("*", ViewUtil.notFound);

        //Set up after-filters (called after each get/post)
        after("*", Filters.addGzipHeader);
    }
}
