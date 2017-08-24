package app.notification;

import app.util.Props;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by IFV-DS1-TUYENVT on 11/07/2017.
 */
public class NotificationController {

    public static Route getNotifications = (Request request, Response response) -> {

        String type = request.queryParams("type");
        String filePath = Props.getValue("json.file.type." + type);
//        FileReader reader = new FileReader(filePath);
        BufferedReader reader = new BufferedReader(new FileReader(filePath));
        Gson gson = new GsonBuilder().disableHtmlEscaping().create();
        String productType = request.queryParams("productType");
        JSONParser jsonParser = new JSONParser();

        List<JSONObject> listData = null;
        try {
            listData = (List<JSONObject>) jsonParser.parse(reader);
        } catch (Exception e) {
            e.printStackTrace();
        }
//            List<JSONObject> listData = (List<JSONObject>) jsonParser.parse(reader);
        for (JSONObject item : listData) {
            if (item.get("productType").toString().equals(productType)) {
                reader.close();
                return gson.toJson(item.get("data"));
            }
        }
        reader.close();
        return null;
    };
    public static Route update = (Request request, Response response) -> {
        String productType = request.queryParams("productType");
        String type = request.queryParams("type");

        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");
        String dateStr = df.format(new Date());
        String filePath = Props.getValue("json.file.type." + type);
        Gson gson = new GsonBuilder().disableHtmlEscaping().create();

//        String filePathTarget = filePath + "_" + dateStr;
        try {
            List<JSONObject> list = null;
            List<JSONObject> listInsert = null;
//            FileUtils.moveFile(FileUtils.getFile(filePath), FileUtils.getFile(filePathTarget));
            JSONParser jsonParser = new JSONParser();
            BufferedReader reader = new BufferedReader(new FileReader(filePath));
            list = (List<JSONObject>) jsonParser.parse(reader);
            List<JSONObject> jsonInsert = convert(request, productType);


            for (JSONObject obj : list) {
                if (obj.get("productType").toString().equals(productType)) {
                    ((JSONObject) obj.get("data")).put("news", jsonInsert);
                    break;
                }
            }
            // write new file
            BufferedWriter file = new BufferedWriter(new FileWriter(filePath));
            Object[] jsonObjectInsert = list.toArray();
            file.write(gson.toJson(jsonObjectInsert));
            file.flush();
            file.close();
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };

    private static List<JSONObject> convert(Request request, String productType) {
        try {
            List<JSONObject> result = new ArrayList<>();
            ObjectMapper mapper = new ObjectMapper();
            List<ItemNotification> listRequest = mapper.readValue(request.body(),
                    TypeFactory.defaultInstance().constructCollectionType(List.class, ItemNotification.class));
            List<String> listTitle = new ArrayList<>();
            for (ItemNotification item : listRequest) {
                listTitle.add(item.getTitle());
            }

            Set<String> set = new HashSet<>(listTitle);

            for (String itemSet : set) {
                JSONObject object = new JSONObject();
                List<ItemNotification> list = new ArrayList<>();
                for (ItemNotification itemNo : listRequest) {
                    if (itemNo.getTitle().equals(itemSet)) {
                        list.add(itemNo);
                    }
                }
                object.put("title", itemSet);
                object.put("list", list);
                result.add(object);
            }
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }
}
