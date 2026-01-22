package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.Admin;
import com.patuljci.gearshare.model.Client;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    private final ClientRepository clientRepository;
    private final AdminRepository  adminRepository;

    public CustomUserDetailsService(UserRepository userRepository, MerchantRepository merchantRepository, ClientRepository clientRepository, AdminRepository adminRepository) {
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.clientRepository = clientRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        Optional<Merchant> merchant = merchantRepository.findMerchantByUserId(user.getId());
        Optional<Client> client = clientRepository.findClientByUserId(user.getId());
        Optional<Admin> admin = adminRepository.findAdminByUserId(user.getId());

        String role = "";
        if (admin.isPresent()) {
            role="ROLE_ADMIN";
        } else if(merchant.isPresent()) {
            role="ROLE_MERCHANT";
        } else if (client.isPresent()) {

            if(client.get().getCanRent()==true){
                role="ROLE_CLIENT";
            }
            else{
                role="ROLE_BANNED";
            }

        } else {
            role="ROLE_NOROLE";
            //throw new UsernameNotFoundException("User not found: " + username);
        }

        System.out.println("User is " + role);

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority(role)));
    }
}
