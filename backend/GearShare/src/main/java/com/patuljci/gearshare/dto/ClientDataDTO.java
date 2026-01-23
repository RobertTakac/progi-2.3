package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientDataDTO {
    private Long client_id;
    private String username;
    private String email;
    private Boolean canRent;
}
