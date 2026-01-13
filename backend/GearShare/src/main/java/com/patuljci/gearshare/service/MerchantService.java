package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.ListingDto;
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

    public ListingDto addListing(Merchant merchant, ListingDto listingDto){

        EquipmentListing listing = new EquipmentListing();
        listing.setMerchant(merchant);


        Optional<EquipmentCategory> category = equipmentCategoryRepository.findEquipmentCategoryByName(listingDto.getCategoryName());
        if(category.isEmpty()){
            System.out.println("Category not found");
            return null;
        }

        listing.setCategory(category.get());
        listing.setTitle(listingDto.getTitle());
        listing.setDescription(listingDto.getDescription());
        listing.setDailyPrice(listingDto.getDailyPrice());
        listing.setDepositAmount(listingDto.getDepositAmount());
        listing.setCurrency(listingDto.getCurrency());
        listing.setAvailableFrom(listingDto.getAvailableFrom());
        listing.setAvailableUntil(listingDto.getAvailableUntil());
        listing.setPickupLocation(listingDto.getPickupLocation());
        listing.setReturnLocation(listingDto.getReturnLocation());
        listing.setIsActive(listingDto.getIsActive());


        equipmentListingRepository.save(listing);

        listingDto.setEmail(merchant.getUser().getEmail());
        return listingDto;
    }

}
