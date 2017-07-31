package app.notification;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by IFV-DS1-TUYENVT on 11/07/2017.
 */
public class NotificationController {


    public static Route getAll = (Request request, Response response) -> {
        String bindVersion = request.queryParams("bvs");
        String filePath = "D:\\notification\\input\\notification_" + bindVersion + ".json";
        FileReader reader = new FileReader(filePath);
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);
        return jsonObject.toString();
    };
    public static Route updateAllNotification = (Request request, Response response) -> {
//        Path source = Paths.get(filePath);
//        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");
//        String data = df.format(new Date());
//        File f = new File(filePath);
//        // rename old file
//        if (f.exists() && !f.isDirectory()) {
//            Files.move(source, source.resolveSibling("notification" + "_" + data + ".json"));
//        }
//        // write new file
//        try {
//            FileWriter file = new FileWriter(filePath);
//            file.write(request.body());
//            file.flush();
//            file.close();
//
//        } catch (IOException e) {
//            e.printStackTrace();
//        }

        return "";
    };

}
