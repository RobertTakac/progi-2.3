package com.patuljci.gearshare.responses;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponse {
    private String token;
    private long expiresIn;
    private String type;

    public LoginResponse(String token, long expiresIn, String type) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.type = type;
    }
}