package com.patuljci.gearshare.service;

import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.repository.MerchantRepository;
import org.springframework.stereotype.Service;

@Service
public class MerchantService {

    private final MerchantRepository merchantRepository;

    MerchantService (MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    Merchant getMerchant(Long id){ //ovo uzima userID, a ne id
        return merchantRepository.findMerchantByUserId(id)
                .orElseGet(()->{
                    return null;
                });
    }

}
