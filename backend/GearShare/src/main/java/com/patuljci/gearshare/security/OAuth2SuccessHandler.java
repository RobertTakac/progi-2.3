package com.patuljci.gearshare.security;

import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.service.AuthenticationService;
import com.patuljci.gearshare.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final AuthenticationService authenticationService;
    private final JwtService jwtService;

    public OAuth2SuccessHandler(@Lazy AuthenticationService authenticationService,
                                JwtService jwtService) {
        this.authenticationService = authenticationService;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        UserEntity user = authenticationService.processGoogleUser(email, name);

        String jwt = jwtService.generateToken(user);

        response.sendRedirect(
                "https://backend-9p6u.onrender.com/oauth2/redirect?token=" + jwt
        );
    }
}
