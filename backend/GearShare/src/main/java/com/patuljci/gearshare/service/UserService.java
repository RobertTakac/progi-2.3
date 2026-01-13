package com.patuljci.gearshare.service;

import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    public UserService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
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