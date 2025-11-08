package com.patuljci.gearshare.service;


import lombok.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    @Value("${security.jwt.secret-key")
    private String secretKey;
    @Value("${security.jwt.expiration-time")
    private long jwtExpiration;
}
