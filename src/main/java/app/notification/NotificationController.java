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
        Gson gson = new GsonBuilder().disableHtmlEscaping().setPrettyPrinting().create();

//        String filePathTarget = filePath + "_" + dateStr;
        try {
            List<JSONObject> list = null;
            List<JSONObject> listInsert = null;
//            FileUtils.moveFile(FileUtils.getFile(filePath), FileUtils.getFile(filePathTarget));
            JSONParser jsonParser = new JSONParser();
            BufferedReader reader = new BufferedReader(new FileReader(filePath));

            list = (List<JSONObject>) jsonParser.parse(reader);
            List<JSONObject> jsonInsert;
            if (type.equals("1")) {
                jsonInsert = convertType1(request, productType);
                for (JSONObject obj : list) {
                    if (obj.get("productType").toString().equals(productType)) {
                        ((JSONObject) obj.get("data")).put("news", jsonInsert);
                        break;
                    }
                }
            } else if (type.equals("2")) {
                JSONObject jsonInsert1 = convertType2(request, productType);
                for (JSONObject obj : list) {
                    if (obj.get("productType").toString().equals(productType)) {
                        ((JSONObject) obj).put("data", jsonInsert1);
                        break;
                    }
                }
            } else {
                jsonInsert = convertType3(request, productType);
                for (JSONObject obj : list) {
                    if (obj.get("productType").toString().equals(productType)) {
                        ((JSONObject) obj).put("data", jsonInsert);
                        break;
                    }
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

    public static Route updateAd = (Request request, Response response) -> {
        String productType = request.queryParams("productType");
        String type = request.queryParams("type");

        DateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");
        String dateStr = df.format(new Date());
        String filePath = Props.getValue("json.file.type." + type);
        Gson gson = new GsonBuilder().disableHtmlEscaping().setPrettyPrinting().create();

        try {
            List<JSONObject> list = null;
            JSONParser jsonParser = new JSONParser();
            BufferedReader reader = new BufferedReader(new FileReader(filePath));

            JSONObject result;
            result = (JSONObject) jsonParser.parse(request.body().toString());
            if (type.equals("1")) {
                for (JSONObject obj : list) {
                    if (obj.get("productType").toString().equals(productType)) {
                        ((JSONObject) obj.get("data")).put("ad", result);
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
            }


        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    };

    private static List<JSONObject> convertType1(Request request, String productType) {
        try {
            List<JSONObject> result = new ArrayList<>();
            ObjectMapper mapper = new ObjectMapper();
            List<ItemType1> listRequest = mapper.readValue(request.body(),
                    TypeFactory.defaultInstance().constructCollectionType(List.class, ItemType1.class));
            List<String> listTitle = new ArrayList<>();
            for (ItemType1 item : listRequest) {
                listTitle.add(item.getTitle());
            }

            Set<String> set = new HashSet<>(listTitle);

            for (String itemSet : set) {
                JSONObject object = new JSONObject();
                List<ItemType1> list = new ArrayList<>();
                for (ItemType1 itemNo : listRequest) {
                    if (itemNo.getTitle().equals(itemSet)) {
                        itemNo.setTitle(itemNo.getSubtitle());
                        if (itemNo.getId().equals("13")) {
                            itemNo.setModal_link(itemNo.getExt_link());
                            itemNo.setExt_link(null);
                            itemNo.setContent(null);
                        }
                        itemNo.setSubtitle(null);
                        itemNo.setIndex(null);
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

    private static JSONObject convertType2(Request request, String productType) {
        try {
            //TODO
            List<Object> listMs = new ArrayList<>();
            JSONObject object = new JSONObject();
            ObjectMapper mapper = new ObjectMapper();
            List<Object> listRequest = mapper.readValue(request.body(),
                    TypeFactory.defaultInstance().constructCollectionType(List.class, Object.class));
            object.put("contents", listRequest);
            object.put("messages", listMs);
            return object;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    private static List<JSONObject> convertType3(Request request, String productType) {
        try {
            List<JSONObject> result = new ArrayList<>();
            ObjectMapper mapper = new ObjectMapper();
            List<ItemType3> listRequest = mapper.readValue(request.body(),
                    TypeFactory.defaultInstance().constructCollectionType(List.class, ItemType3.class));
            for (ItemType3 item : listRequest) {
                JSONObject obj = new JSONObject();
                obj.put("id", item.getId());
                obj.put("date", item.getDate());
                obj.put("title", item.getTitle());
                obj.put("content", item.getContent());
                obj.put("thumbnail", item.getThumbnail());
                obj.put("ext_link", item.getExt_link());
                obj.put("is_show", item.getIs_show());
                result.add(obj);
            }
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }
}
