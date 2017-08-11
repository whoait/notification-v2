package app;

import app.notification.ItemNotificationDao;
import app.notification.NotificationController;
import app.util.Filters;
import app.util.Path;
import app.util.ViewUtil;
import spark.Spark;
import spark.servlet.SparkApplication;

import static spark.Spark.get;

import static spark.Spark.*;

public class Application implements SparkApplication {

    public static ItemNotificationDao itemNotificationDao;

    public void init() {


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

        before((request,response)->{
            String method = request.requestMethod();
            if(method.equals("POST") || method.equals("PUT") || method.equals("DELETE")){
                String authentication = request.headers("Authentication");
                if(!"PASSWORD".equals(authentication)){
                    halt(401, "User Unauthorized");
                }
            }
        });

        options("/*", (request,response)->{

            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if(accessControlRequestMethod != null){
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request,response)->{
            response.header("Access-Control-Allow-Origin", "*");
        });
    }
}
