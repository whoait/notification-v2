package app.notification;

import app.util.Props;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.apache.commons.io.FileUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import spark.Request;
import spark.Response;
import spark.Route;

import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by IFV-DS1-TUYENVT on 11/07/2017.
 */
public class NotificationController {

    public static Route getListBind = (Request request, Response response) -> {
        List<String> result = new ArrayList<>();
        try {
            String type = request.queryParams("type");
            String filePath = Props.getValue("json.file.type." + type);
            FileReader reader = new FileReader(filePath);
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);
            List<JSONObject> list = (List<JSONObject>) jsonObject.get("news");
            for (JSONObject obj : list) {
                result.add(obj.get("version").toString());
            }
            reader.close();
            Gson gson = new Gson();
            return gson.toJson(result);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };

    public static Route getNotifications = (Request request, Response response) -> {
        List<JSONObject> list = null;
        try {
            String version = request.queryParams("bvs");
            String type = request.queryParams("type");
            String filePath = Props.getValue("json.file.type." + type);
            FileReader reader = new FileReader(filePath);
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObject = (JSONObject) jsonParser.parse(reader);
            list = (List<JSONObject>) jsonObject.get("news");
            for (JSONObject obj : list) {
                if (obj.get("version").toString().equals(version)) {
                    list = (List<JSONObject>) obj.get("data");
                }
            }
            List<ItemNotification> result = parseListToRow(list);

            Gson gson = new GsonBuilder().disableHtmlEscaping().create();
            reader.close();
            return gson.toJson(result);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };

    private static List<ItemNotification> parseListToRow(List<JSONObject> list) {
        List<ItemNotification> result = new ArrayList<>();
        for (JSONObject object : list) {
            List<JSONObject> listChild = (List<JSONObject>) object.get("list");
            for (JSONObject objChild : listChild) {
                ItemNotification obj = new ItemNotification();
                obj.setTitle(object.get("title").toString());
                obj.setContent(objChild.get("content") != null ? objChild.get("content").toString() : "");
                obj.setDate(objChild.get("date").toString());
                obj.setSubtitle(objChild.get("title").toString());
                obj.setExt_link(objChild.get("ext_link") != null ? objChild.get("ext_link").toString() : objChild.get("modal_link").toString());
                obj.setId(objChild.get("id").toString());
                obj.setIs_show(objChild.get("is_show").toString());
                result.add(obj);
            }

        }
        return result;
    }


    public static Route update = (Request request, Response response) -> {
        String version = request.queryParams("bvs");
        String type = request.queryParams("type");

        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");
        String dateStr = df.format(new Date());
        String filePath = Props.getValue("json.file.type." + type);

//        String filePathTarget = filePath + "_" + dateStr;
        try {


            List<JSONObject> list = null;
            List<JSONObject> listInsert = null;
//            FileUtils.moveFile(FileUtils.getFile(filePath), FileUtils.getFile(filePathTarget));
            JSONParser jsonParser = new JSONParser();
            FileReader reader = new FileReader(filePath);
            JSONObject jsonSource = (JSONObject) jsonParser.parse(reader);
            JSONObject jsonInsert = convert(request, version);

            list = (List<JSONObject>) jsonSource.get("news");
            for (JSONObject obj : list) {
                if (obj.get("version").toString().equals(version)) {
                    list.remove(obj);
                    list.add(jsonInsert);
                    break;
                }
            }
            jsonSource.put("news", list);
            // write new file
            FileWriter file = new FileWriter(filePath);
            file.write(jsonSource.toJSONString());
            file.flush();
            file.close();
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };

    private static JSONObject convert(Request request, String bvs) {
        try {
            List<JSONObject> listObject = new ArrayList<>();
            JSONObject result = new JSONObject();
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
                object.put("list",new GsonBuilder().disableHtmlEscaping().create().toJson(list));
                listObject.add(object);
            }
            result.put("version", bvs);
            result.put("data", listObject);
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }
}
