package com.patuljci.gearshare.model;

import com.patuljci.gearshare.config.SpringContext;
import com.patuljci.gearshare.service.GeocodingService;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Component;


public class EquipmentListingGeocodingListener {





    @PrePersist
    @PreUpdate
    public void geocode(EquipmentListing listing) {
        try {
            GeocodingService geocodingService = SpringContext.getBean(GeocodingService.class);

            if (needsGeocoding(listing.getPickupLatitude(), listing.getPickupLongitude())) {
                double[] coords = geocodingService.getCoordinates(
                        listing.getPickupAddress(),
                        listing.getPickupArea(),
                        listing.getPickupCity(),
                        listing.getPickupPostalCode(),
                        listing.getPickupCountry()
                );
                listing.setPickupLatitude(coords[0]);
                listing.setPickupLongitude(coords[1]);
            }


            if (needsGeocoding(listing.getReturnLatitude(), listing.getReturnLongitude())) {
                double[] coords = geocodingService.getCoordinates(
                        listing.getReturnAddress(),
                        listing.getReturnArea(),
                        listing.getReturnCity(),
                        listing.getReturnPostalCode(),
                        listing.getReturnCountry()
                );
                listing.setReturnLatitude(coords[0]);
                listing.setReturnLongitude(coords[1]);
            }
        } catch (Exception e) {
            System.out.println("Error geocoding");
            System.out.println(e);

        }
    }

    private boolean needsGeocoding(Double lat, Double lng) {
        return lat == null || lng == null;
    }
}