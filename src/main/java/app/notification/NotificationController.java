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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by IFV-DS1-TUYENVT on 11/07/2017.
 */
public class NotificationController {

    public static Route getListGroupByType = (Request request, Response response) -> {
        List<JSONObject > list = null;
        List<String> result = new ArrayList<>();
        try {
            String type = request.queryParams("type");
            String filePath = Props.getValue("json.file.type." + type);
            FileReader reader = new FileReader(filePath);
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);
            list = (List<JSONObject >) jsonObject.get("news");
            for (JSONObject obj : list) {
                result.add(obj.get("version").toString());
            }
            reader.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    };


    public static Route getListByGroupAndType = (Request request, Response response) -> {
        List<JSONObject > list = null;
        String result = null;
        try {
            String version = request.queryParams("version");
            String type = request.queryParams("type");
            String filePath = Props.getValue("json.file.type." + type);
            FileReader reader = new FileReader(filePath);
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);
            list = (List<JSONObject >) jsonObject.get("news");
            for (JSONObject obj : list) {
                if(obj.get("version").toString().equals(version)){
                    result =  obj.get("data").toString();
                }
            }
            reader.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    };

    public static Route updateListByGroupAndType = (Request request, Response response) -> {
        String version = request.queryParams("version");
        String type = request.queryParams("type");

        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");
        String dateStr = df.format(new Date());
        String filePath = Props.getValue("json.file.type." + type);

        String filePathTarget = filePath + "_" + dateStr;
        try {
            FileUtils.moveFile(FileUtils.getFile(filePath), FileUtils.getFile(filePathTarget));
            JSONParser jsonParser = new JSONParser();
            FileReader reader = new FileReader(filePath);
            JSONObject jsonSource = (JSONObject) jsonParser.parse(reader);
            JsonArray jsonArray = new JsonParser().parse(request.queryParams("data")).getAsJsonArray();

            JSONObject jsonData = new JSONObject();
            jsonData.put("version", version);
            jsonData.put("data", jsonArray);

            jsonSource.put("news", jsonData);
            // write new file
            FileWriter file = new FileWriter(filePath);
            file.write(jsonSource.toJSONString());
            file.flush();
            file.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };
}
