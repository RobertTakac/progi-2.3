package com.patuljci.gearshare.service;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class GeocodingService {

    private static final String NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";
    private static final String USER_AGENT = "GearShareStudentProject (contact: brankozastava@gmail.com)";

    public double[] getCoordinates(String address, String area, String city,
                                   String postalCode, String country) throws Exception {


        StringBuilder full = new StringBuilder(address.trim());
        if (area != null && !area.isBlank()) {
            full.append(", ").append(area.trim());
        }
        full.append(", ").append(city.trim())
                .append(", ").append(postalCode.trim())
                .append(", ").append(country.trim());

        String query = full.toString();


        String urlString = NOMINATIM_BASE +
                "?q=" + URLEncoder.encode(query, StandardCharsets.UTF_8) +
                "&format=json" +
                "&limit=1" +
                "&countrycodes=hr" +
                "&addressdetails=1";

        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();


        conn.setRequestMethod("GET");
        conn.setRequestProperty("User-Agent", USER_AGENT);
        conn.setRequestProperty("Accept", "application/json");

        conn.setConnectTimeout(8000);
        conn.setReadTimeout(8000);


        String response = new String(conn.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

        JSONArray results = new JSONArray(response);

        if (results.length() == 0) {
            throw new RuntimeException("Nominatim: No results found for: " + query);
        }

        JSONObject firstResult = results.getJSONObject(0);

        double lat = firstResult.getDouble("lat");
        double lon = firstResult.getDouble("lon");

        return new double[]{lat, lon};
    }
}