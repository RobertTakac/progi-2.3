package com.patuljci.gearshare.model;

import com.patuljci.gearshare.service.GeocodingService;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;



@Component
@RequiredArgsConstructor
public class MerchantGeocodingListener {


    private final GeocodingService geocodingService;

    @PrePersist
    @PreUpdate
    public void geocode(Merchant merchant) {
        try {

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