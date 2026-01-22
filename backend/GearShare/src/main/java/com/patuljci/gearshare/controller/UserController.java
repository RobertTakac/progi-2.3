package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.UserDTO;
import com.patuljci.gearshare.model.Client;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.UserRepository;
import com.patuljci.gearshare.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /*
    @GetMapping("/mee")
    public ResponseEntity<UserEntity> authenticatedUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        System.out.println("username: " + username);
        //UserEntity currentUser = userRepository.findByUsername(username);

        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //UserEntity currentUser = (UserEntity) authentication.getPrincipal();
        //return ResponseEntity.ok(currentUser);
        return ResponseEntity.ok(new UserEntity());
    } */

    @GetMapping("/me")
    public UserDTO getMyRole(Authentication authentication) {


        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_NOROLE");


        UserDTO userDTO = userService.myInfo();
        userDTO.setRole(role);

        return userDTO;
    }

    @GetMapping("/test")
    public ResponseEntity<String> testing() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        System.out.println("username: " + username);

        boolean isMerchant = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_MERCHANT"));
        System.out.println("isMerchant: " + isMerchant);

        isMerchant = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_CLIENT"));
        System.out.println("isClient: " + isMerchant);

        isMerchant = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_NOROLE"));
        System.out.println("norole: " + isMerchant);
        //UserEntity currentUser = userRepository.findByUsername(username);

        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //UserEntity currentUser = (UserEntity) authentication.getPrincipal();
        //return ResponseEntity.ok(currentUser);
        return ResponseEntity.ok("proslo");
    }

    /*
    @GetMapping("/")
    public ResponseEntity<List<UserEntity>> allUsers() {
        List <UserEntity> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/crateUser")
    public UserEntity createUser(@RequestBody UserEntity user) {
        return userService.createUser(user);
    }
    */

}