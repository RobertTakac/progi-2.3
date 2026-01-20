package com.patuljci.gearshare.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class GeocodingService {

    private static final String BASE_URL = "https://eu1.locationiq.com/v1/search";


    @Value("${locationiq.token:}")
    private String LOCATIONIQ_TOKEN;

    private static final String USER_AGENT =
            "GearShareApp/1.0 (student project; https://progi-2-3-ah5i.onrender.com/; brankozastava@gmail.com)";

    public double[] getCoordinates(String address, String area, String city, String postalCode, String country)
            throws Exception {


        StringBuilder full = new StringBuilder(address.trim());
        if (area != null && !area.isBlank()) {
            full.append(", ").append(area.trim());
        }
        full.append(", ").append(city.trim())
                .append(", ").append(postalCode.trim())
                .append(", ").append(country.trim());

        String query = full.toString();


        String urlString = BASE_URL + "?" +
                "q=" + URLEncoder.encode(query, StandardCharsets.UTF_8) +
                "&key=" + LOCATIONIQ_TOKEN +
                "&format=json" +
                "&limit=1" +
                "&countrycodes=hr" +
                "&addressdetails=1";

        URL url = new URL(urlString);
        HttpURLConnection conn = null;

        try {
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", USER_AGENT);
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("Referer", "https://progi-2-3-ah5i.onrender.com/");
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);


            String response = new String(conn.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            JSONArray results = new JSONArray(response);

            if (results.length() == 0) {
                throw new RuntimeException("LocationIQ: No results found for: " + query);
            }

            JSONObject firstResult = results.getJSONObject(0);
            double lat = firstResult.getDouble("lat");
            double lon = firstResult.getDouble("lon");

            return new double[]{lat, lon};

        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }
}