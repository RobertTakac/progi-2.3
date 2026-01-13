package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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

    @GetMapping("/me")
    public ResponseEntity<UserEntity> authenticatedUser() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        System.out.println("username: " + username);
        //UserEntity currentUser = userRepository.findByUsername(username);

        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //UserEntity currentUser = (UserEntity) authentication.getPrincipal();
        //return ResponseEntity.ok(currentUser);
        return ResponseEntity.ok(new UserEntity());
    }
    @GetMapping("/test")
    public ResponseEntity<String> testing() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        System.out.println("username: " + username);
        //UserEntity currentUser = userRepository.findByUsername(username);

        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //UserEntity currentUser = (UserEntity) authentication.getPrincipal();
        //return ResponseEntity.ok(currentUser);
        return ResponseEntity.ok("proslo");
    }

    @GetMapping("/")
    public ResponseEntity<List<UserEntity>> allUsers() {
        List <UserEntity> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/crateUser")
    public UserEntity createUser(@RequestBody UserEntity user) {
        return userService.createUser(user);
    }

}