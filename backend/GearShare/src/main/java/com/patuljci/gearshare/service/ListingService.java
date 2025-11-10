package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.EquipmentCategory;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.User;
import com.patuljci.gearshare.repository.EquipmentCategoryRepository;
import com.patuljci.gearshare.repository.EquipmentListingRepository;
import com.patuljci.gearshare.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ListingService {

    private final EquipmentListingRepository equipmentListingRepository;
    private final EquipmentCategoryRepository equipmentCategoryRepository;
    private final UserRepository userRepository;

    ListingService(EquipmentListingRepository equipmentListingRepository,
                   EquipmentCategoryRepository equipmentCategoryRepository,
                   UserRepository userRepository) {
        this.equipmentListingRepository = equipmentListingRepository;
        this.equipmentCategoryRepository = equipmentCategoryRepository;
        this.userRepository = userRepository;
    }

    public void createListing(ListingDto listingDto) {

        EquipmentListing equipmentListing = new EquipmentListing();

        //provjera postoji li email
        //TODO provjera jel to email od trgovca
        User newUser = userRepository.findByEmail(listingDto.getEmail())
                .orElseGet(() -> {
                    return null;
                });
        equipmentListing.setMerchant(new Merchant());

        //provjera postoji li kategorija
        EquipmentCategory equipmentCategory = equipmentCategoryRepository.findEquipmentCategoryByName(listingDto.getCategoryName())
                .orElseGet(() -> {
                    return null;
                });

        equipmentListing.setCategory(equipmentCategory);

        //namjestanje ostalih vrijednosti
        equipmentListing.setTitle(listingDto.getTitle());
        equipmentListing.setDescription(listingDto.getDescription());
        equipmentListing.setDailyPrice(listingDto.getDailyPrice());
        equipmentListing.setDepositAmount(listingDto.getDepositAmount());
        equipmentListing.setCurrency(listingDto.getCurrency());
        equipmentListing.setAvailableFrom(listingDto.getAvailableFrom());
        equipmentListing.setAvailableUntil(listingDto.getAvailableUntil());
        equipmentListing.setPickupLocation(listingDto.getPickupLocation());
        equipmentListing.setReturnLocation(listingDto.getReturnLocation());
        equipmentListing.setQuantityAvailable(listingDto.getQuantityAvailable());
        equipmentListing.setIsActive(listingDto.getIsActive());


        equipmentListingRepository.save(equipmentListing);
    }

}
