package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientRegisterDTO {
    private String email;
    private String password;
    private String username;
    private String location;
}
