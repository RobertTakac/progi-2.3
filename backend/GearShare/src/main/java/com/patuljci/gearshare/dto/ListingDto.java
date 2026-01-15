package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
public class ListingDto {
    private Long id;
    private Long merchantID;
    private String categoryName;
    private String title;
    private String description;
    private BigDecimal dailyPrice;
    private BigDecimal depositAmount;
    private String currency;
    private LocalDateTime availableFrom;
    private LocalDateTime availableUntil;
    private String pickupLocation;
    private String returnLocation;
    private Integer quantityAvailable;
    private Boolean isActive;
}
