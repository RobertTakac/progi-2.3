package com.patuljci.gearshare.model;

import com.patuljci.gearshare.service.GeocodingService;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EquipmentListingGeocodingListener {

    private static final Logger log = LoggerFactory.getLogger(EquipmentListingGeocodingListener.class);

    private final GeocodingService geocodingService;

    @PrePersist
    @PreUpdate
    public void geocode(EquipmentListing listing) {
        try {

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
            log.warn("Geocoding nije uspio za listing id={}, adresa: {} / {} ",
                    listing.getListingId(),
                    listing.getPickupAddress(),
                    listing.getReturnAddress(),
                    e);

        }
    }

    private boolean needsGeocoding(Double lat, Double lng) {
        return lat == null || lng == null;
    }
}