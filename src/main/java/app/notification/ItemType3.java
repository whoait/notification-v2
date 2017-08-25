package app.notification;

/**
 * Created by IFV-DS1-TUYENVT on 11/07/2017.
 */
public class ItemType3 {
    private String id;
    private String date;
    private String title;
    private String content;
    private String thumbnail;
    private String ext_link;
    private String is_show;
    private String index;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String subtitle) {
        this.thumbnail = subtitle;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getIs_show() {
        return is_show;
    }

    public void setIs_show(String is_show) {
        this.is_show = is_show;
    }

    public String getExt_link() {
        return ext_link;
    }

    public void setExt_link(String ext_link) {
        this.ext_link = ext_link;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }
}
