package app.util;

import lombok.Getter;

public class Path {

    // The @Getter methods are needed in order to access
    // the variables from Velocity Templates
    public static class Web {
        @Getter
        public static final String NOTIFICATIONS = "/notifications";
        @Getter
        public static final String UPDATE = "/update";

        @Getter
        public static final String UPDATE_AD = "/updateAd";

    }
}
