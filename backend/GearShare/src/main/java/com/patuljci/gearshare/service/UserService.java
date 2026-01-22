package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.UserDTO;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.MerchantRepository;
import com.patuljci.gearshare.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    public UserService(UserRepository userRepository, EmailService emailService, MerchantRepository merchantRepository) {
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
    }


    public UserDTO myInfo(){

        String clientUser = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(clientUser);
        Merchant merchant = merchantRepository.getMerchantsByUser(user);


        UserDTO userDTO = new UserDTO();

        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());

        if(merchant != null){
            userDTO.setAddress(merchant.getAddress());
            userDTO.setCity(merchant.getCity());
            userDTO.setCountry(merchant.getCountry());
            userDTO.setBusinessName(merchant.getBusinessName());
            userDTO.setDescription(merchant.getDescription());
            userDTO.setPostalCode(merchant.getPostalCode());
        }

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