package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class MerchantAdminDTO {

    private Long id;
    private String businessName;
    private String city;
    private String country;
    private BigDecimal averageRating;
}
