package com.patuljci.gearshare;

import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.service.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
public class HomeController {

    private final UserService userService;

    HomeController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/")
    public String index() {
        return"index.html";
    }

    /*
    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal OAuth2User oauthUser) {
        String name = oauthUser.getAttribute("name");
        String email = oauthUser.getAttribute("email");

        userService.createUser(new User(name, email, "lozinka"));

        return "Welcome, " + name + " (" + email + ")";
    }
    */
    @GetMapping("/profile")
    public String profile(@AuthenticationPrincipal OAuth2User oauthUser) {
        String name = oauthUser.getAttribute("name");
        String email = oauthUser.getAttribute("email");


        userService.createUser(new UserEntity(name, email, "lozinka"));

        return "Welcome, " + name + " (" + email + ")";
    }

}
