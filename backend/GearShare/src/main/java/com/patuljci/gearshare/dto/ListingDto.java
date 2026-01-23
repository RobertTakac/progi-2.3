package com.patuljci.gearshare.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ListingDto {
    private Long id;
    private Long merchantID;

    private String categoryName;
    private String title;
    private String description;
    private String prodImg;
    private BigDecimal dailyPrice;
    private BigDecimal depositAmount;
    private String currency;
    private LocalDateTime availableFrom;
    private LocalDateTime availableUntil;

    private String pickupAddress;
    private String pickupArea;
    private String pickupCity;
    private String pickupPostalCode;
    private String pickupCountry;
    private Double pickupLatitude;
    private Double pickupLongitude;


    private String returnAddress;
    private String returnArea;
    private String returnCity;
    private String returnPostalCode;
    private String returnCountry;
    private Double returnLatitude;
    private Double returnLongitude;

    private Integer quantityAvailable;
    private Boolean isActive;
}
