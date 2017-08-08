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

import static java.nio.file.StandardCopyOption.ATOMIC_MOVE;

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

    Path newName(Path oldFile, String newNameString) {
        // the magic is done by Path.resolve(...)
        return oldFile.getParent().resolve(newNameString);
    }


    public static Route updateAllNotification = (Request request, Response response) -> {
        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");
        String dateStr = df.format(new Date());

        String filePath = "D:\\notification\\input\\notification.json";
        String filePathTarget = "D:\\notification\\input\\notification_" + dateStr + ".json";


        try {
            FileUtils.moveFile(
                    FileUtils.getFile(filePath),
                    FileUtils.getFile(filePathTarget));

            String bindVersion = request.queryParams("bvs");

            JSONParser jsonParser = new JSONParser();
            FileReader reader = new FileReader(filePathTarget);
            JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);
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
