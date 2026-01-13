package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MerchantRegisterDTO {
        private String email;
        private String password;
        private String username;

        private String businessName;
        private String address;
        private String city;
        private String postalCode;
        private String country;
        private String description;
}
