package app.util;

import java.io.IOException;
import java.util.Properties;

public class Props {


    private static Props instance = new Props();

    private Properties props = new Properties();

    private Props() {
        ClassLoader loader = Props.class.getClassLoader();

        props = new Properties();
        try {
            props.loadFromXML(loader.getResourceAsStream("settings.xml"));
        } catch (IOException e) {
        }
    }

    public static String getValue(String key) {
        return instance.props.getProperty(key);
    }
}
