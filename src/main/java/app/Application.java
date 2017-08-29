package app;

import app.notification.NotificationController;
import app.util.Path;
import spark.servlet.SparkApplication;

import static spark.Spark.*;

public class Application implements SparkApplication {

    public static NotificationController notificationController;

    public void init() {
        port(8080);
        before((request, response) -> {
            response.header("Access-Control-Allow-Origin", "*");
            response.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, HEAD, OPTIONS");
            response.header("Access-Control-Allow-Headers", "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
            response.header("Access-Control-Expose-Headers", "Access-Control-Allow-Origin, Access-Control-Allow-Credentials");
            response.header("Access-Control-Allow-Credentials", "true");
        });
//        get(Path.Web.BINDVERSION, NotificationController.getListBind);
        get(Path.Web.NOTIFICATIONS, NotificationController.getNotifications);
        post(Path.Web.UPDATE, NotificationController.update);
        post(Path.Web.UPDATE_AD, NotificationController.updateAd);
    }
}
