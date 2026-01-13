package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.NewListingDto;
import com.patuljci.gearshare.model.EquipmentCategory;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.EquipmentCategoryRepository;
import com.patuljci.gearshare.repository.EquipmentListingRepository;
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
    private final EquipmentCategoryRepository equipmentCategoryRepository;
    private final EquipmentListingRepository equipmentListingRepository;

    MerchantService (MerchantRepository merchantRepository, UserRepository userRepository, ListingService listingService, EquipmentCategoryRepository equipmentCategoryRepository, EquipmentListingRepository equipmentListingRepository) {
        this.merchantRepository = merchantRepository;
        this.userRepository = userRepository;
        this.listingService = listingService;
        this.equipmentCategoryRepository = equipmentCategoryRepository;
        this.equipmentListingRepository = equipmentListingRepository;
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

    public boolean test(String categoryName){
        Optional<EquipmentCategory> category = equipmentCategoryRepository.findEquipmentCategoryByName(categoryName);
        if  (category.isPresent()){
            return true;
        }
        return false;
    }

    public NewListingDto addListing(Merchant merchant, NewListingDto newListingDto){

        EquipmentListing listing = new EquipmentListing();
        listing.setMerchant(merchant);


        Optional<EquipmentCategory> category = equipmentCategoryRepository.findEquipmentCategoryByName(newListingDto.getCategoryName());
        if(category.isEmpty()){
            System.out.println("Category not found");
            return null;
        }

        listing.setCategory(category.get());
        listing.setTitle(newListingDto.getTitle());
        listing.setDescription(newListingDto.getDescription());
        listing.setDailyPrice(newListingDto.getDailyPrice());
        listing.setDepositAmount(newListingDto.getDepositAmount());
        listing.setCurrency(newListingDto.getCurrency());
        listing.setAvailableFrom(newListingDto.getAvailableFrom());
        listing.setAvailableUntil(newListingDto.getAvailableUntil());
        listing.setPickupLocation(newListingDto.getPickupLocation());
        listing.setReturnLocation(newListingDto.getReturnLocation());
        listing.setIsActive(newListingDto.getIsActive());


        equipmentListingRepository.save(listing);

        //newListingDto.setEmail(merchant.getUser().getEmail());
        return newListingDto;
    }

}
