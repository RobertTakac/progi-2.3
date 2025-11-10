package com.patuljci.gearshare;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String index() {
        return"index.html";
    }

    @GetMapping("/profile")
    public String googleLogin(@AuthenticationPrincipal UserDetails userDetails){

        System.out.println("userDetails:"+userDetails);

        return "dobro je";
    }

}
