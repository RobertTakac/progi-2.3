package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.UserDTO;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
    }


    public UserDTO myInfo(){

        String clientUser = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(clientUser);



        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());

        return userDTO;
    }

    public List<UserEntity> allUsers() {
        List<UserEntity> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }


    public UserEntity createUser(UserEntity user){

        UserEntity newUser = userRepository.findByEmail(user.getEmail())
                .orElseGet(() -> userRepository.save(user));

        return newUser;
    }

}