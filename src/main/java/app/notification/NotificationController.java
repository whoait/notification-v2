package app.notification;

import app.util.Props;
import com.google.gson.JsonArray;
import com.google.gson.JsonParser;
import org.apache.commons.io.FileUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Path;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * Created by IFV-DS1-TUYENVT on 11/07/2017.
 */
public class NotificationController {

    public static Route getListGroupByType = (Request request, Response response) -> {
        List<Object> list = null;
        try {
            String type = request.queryParams("type");
            String filePath = Props.getValue("json.file");
            FileReader reader = new FileReader(filePath);
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);

            JSONObject jsonResult = new JSONObject();

            list = (List<Object>) jsonObject.get("news");

            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return list;
    };



    public static Route getAll = (Request request, Response response) -> {
        try {
            String version = request.queryParams("version");
            String type = request.queryParams("type");
            String filePath =  Props.getValue("json.file");
            FileReader reader = new FileReader(filePath);
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);
            reader.close();

            JSONObject jsonResult = new JSONObject();
            jsonResult.put("news_7", jsonObject.get("news_" + 7));
            jsonResult.put("news_8", jsonObject.get("news_" + 8));
            jsonResult.put("news_9", jsonObject.get("news_" + 9));
            return jsonResult.toString();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };

    Path newName(Path oldFile, String newNameString) {
        // the magic is done by Path.resolve(...)
        return oldFile.getParent().resolve(newNameString);
    }


    public static Route updateAllNotification = (Request request, Response response) -> {
        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");
        String dateStr = df.format(new Date());
        String filePath =  Props.getValue("json.file");
        String filePathTarget =  Props.getValue("json.path") + "notification_" + dateStr + ".json";


        try {
            FileUtils.moveFile(FileUtils.getFile(filePath), FileUtils.getFile(filePathTarget));

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
