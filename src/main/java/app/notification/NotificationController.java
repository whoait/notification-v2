package app.notification;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import com.sun.corba.se.impl.orbutil.ObjectWriter;
import org.apache.commons.io.FileUtils;
import org.apache.velocity.util.ArrayListWrapper;
import org.json.simple.JSONArray;
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
import java.nio.file.StandardCopyOption;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

/**
 * Created by IFV-DS1-TUYENVT on 11/07/2017.
 */
public class NotificationController {


    public static Route getAll = (Request request, Response response) -> {
//        String bindVersion = request.queryParams("bvs");
        String filePath = "D:\\notification\\input\\notification.json";
        FileReader reader = new FileReader(filePath);
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);

        JSONObject jsonResult = new JSONObject();
        jsonResult.put("news_7", jsonObject.get("news_" + 7));
        jsonResult.put("news_8", jsonObject.get("news_" + 8));
        jsonResult.put("news_9", jsonObject.get("news_" + 9));

        return jsonResult.toString();
    };
    public static Route updateAllNotification = (Request request, Response response) -> {

        String filePath = "D:\\notification\\input\\notification.json";
        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");
        String dateStr = df.format(new Date());
        String filePathNew = "D:\\notification\\input\\notification_" + dateStr + ".json";


        File f = new File(filePath);
        //rename old file


        String bindVersion = request.queryParams("bvs");

        try {

            JSONParser jsonParser = new JSONParser();
            FileReader reader = new FileReader(filePath);
            JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);

            //rename old file
            Path source = Paths.get("D:\\notification\\input\\");
            if (f.exists() && !f.isDirectory()) {
//                f.renameTo(new File(filePathNew));
                Files.move(source, source.resolveSibling("notification_" + dateStr + ".json"), StandardCopyOption.REPLACE_EXISTING);
            }

            JsonArray jsonArray = new JsonParser().parse(request.queryParams("news")).getAsJsonArray();

            if (bindVersion.equals("7")) {
                jsonObject.put("news_7", jsonArray);
            } else if (bindVersion.equals("8")) {
                jsonObject.put("news_8", jsonArray);
            } else if (bindVersion.equals("9")) {
                jsonObject.put("news_9", jsonArray);
            }

            // write new file
            FileWriter file = new FileWriter(filePath);
            file.write(jsonObject.toJSONString());
            file.flush();
            file.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "";
    };

}
