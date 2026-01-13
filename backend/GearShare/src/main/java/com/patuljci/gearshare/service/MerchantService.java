package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.MerchantRepository;
import com.patuljci.gearshare.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MerchantService {

    private final MerchantRepository merchantRepository;
    private final UserRepository userRepository;
    private final ListingService listingService;

    MerchantService (MerchantRepository merchantRepository, UserRepository userRepository, ListingService listingService) {
        this.merchantRepository = merchantRepository;
        this.userRepository = userRepository;
        this.listingService = listingService;
    }

    Merchant getMerchant(Long id){ //ovo uzima userID, a ne id
        return merchantRepository.findMerchantByUserId(id)
                .orElseGet(()->{
                    return null;
                });
    }

    public Optional<Merchant> optionalMerchant(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        UserEntity user = userRepository.findByUsername(username);

        Optional<Merchant> merchant = merchantRepository.findMerchantByUserId(user.getId());

        return merchant;
        //UserEntity currentUser = userRepository.findByUsername(username);
    }

    public ListingDto addListing(){

        ListingDto dto = new ListingDto();
        dto.setTitle("Uspjeh");


        return dto;
    }

}
