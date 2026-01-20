package com.patuljci.gearshare.model;

import com.patuljci.gearshare.config.SpringContext;
import com.patuljci.gearshare.service.GeocodingService;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;




public class MerchantGeocodingListener {




    @PrePersist
    @PreUpdate
    public void geocode(Merchant merchant) {
        try {
            GeocodingService geocodingService = SpringContext.getBean(GeocodingService.class);

            if (merchant.getLatitude() != null && merchant.getLongitude() != null) {
                return;
            }

            double[] coords = geocodingService.getCoordinates(
                    merchant.getAddress(),
                    null,
                    merchant.getCity(),
                    merchant.getPostalCode(),
                    merchant.getCountry()
            );

            merchant.setLatitude(coords[0]);
            merchant.setLongitude(coords[1]);


        } catch (Exception e) {
           System.out.println(e);

        }
    }
}