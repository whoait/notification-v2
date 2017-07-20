package app.notification;

import java.util.Date;

/**
 * Created by IFV-DS1-TUYENVT on 11/07/2017.
 */
public class ItemNotification {
    public Integer id;
    public String date;
    public String title;
    public String content;
    public String ext_link;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getExt_link() {
        return ext_link;
    }

    public void setExt_link(String ext_link) {
        this.ext_link = ext_link;
    }

    public ItemNotification(Integer id, String date, String title, String content, String ext_link) {
        this.id = id;
        this.date = date;
        this.title = title;
        this.content = content;
        this.ext_link = ext_link;
    }

}
