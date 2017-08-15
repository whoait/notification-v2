package app.util;

import lombok.Getter;

public class Path {

    // The @Getter methods are needed in order to access
    // the variables from Velocity Templates
    public static class Web {
        @Getter public static final String NOTIFICATIONS = "/notifications/";
        @Getter public static final String UPDATE = "/update/";
        @Getter public static final String LISTGROUP = "/getListGroupByVerion/";

    }

    public static class Template {
//        public final static String NOTIFICATION_ALL = "/velocity/notification/index.html";
        public static final String NOT_FOUND = "/velocity/notFound.vm";
    }

}
