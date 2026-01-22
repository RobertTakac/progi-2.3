package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDTO {
    private String username;
    private String email;
    private String role;

    private String businessName;
    private String address;
    private String city;
    private String postalCode;
    private String country;
    private String description;

}
