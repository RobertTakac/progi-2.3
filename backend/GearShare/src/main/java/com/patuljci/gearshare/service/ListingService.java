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

import java.util.List;

@Service
public class ListingService {

    private final EquipmentListingRepository equipmentListingRepository;
    private final EquipmentCategoryRepository equipmentCategoryRepository;
    private final UserRepository userRepository;
    private final MerchantService merchantService;

    ListingService(EquipmentListingRepository equipmentListingRepository,
                   EquipmentCategoryRepository equipmentCategoryRepository,
                   UserRepository userRepository,  MerchantService merchantService) {
        this.equipmentListingRepository = equipmentListingRepository;
        this.equipmentCategoryRepository = equipmentCategoryRepository;
        this.userRepository = userRepository;
        this.merchantService = merchantService;
    }


    public List<EquipmentListing> allListings(){
        return equipmentListingRepository.findAll();
    }
    public List<EquipmentCategory> allCategories(){
        return equipmentCategoryRepository.findAll();
    }


    public List<EquipmentListing> allListingsByCategory(String category){

        EquipmentCategory equipmentCategory = equipmentCategoryRepository.findEquipmentCategoryByName(category)
                .orElseGet(()-> {return null;});
        if(equipmentCategory == null){return null;}

        return equipmentListingRepository.findEquipmentListingByCategory(equipmentCategory)
                .orElseGet(()-> {return null; });//mozda bi se trebalo zamijenit s praznom listom
    }

    public EquipmentListing createListing(ListingDto listingDto) {

        EquipmentListing equipmentListing = new EquipmentListing();

        //provjera postoji li email
        User newUser = userRepository.findByEmail(listingDto.getEmail())
                .orElseGet(() -> {
                    //System.out.println("nepostojeci mail");
                    return null;
                });
        if(newUser == null) { return null;}

        //provjera jel to email od trgovca
        Merchant merchant = merchantService.getMerchant(newUser.getId());


        if(merchant == null) {
            //System.out.println("nije trgovac");
            return null;}

        equipmentListing.setMerchant(merchant);



        //provjera postoji li kategorija
        EquipmentCategory equipmentCategory = equipmentCategoryRepository.findEquipmentCategoryByName(listingDto.getCategoryName())
                .orElseGet(() -> {
                    return null;
                });
        if (equipmentCategory == null) {
            return null;
        }

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


        return equipmentListingRepository.save(equipmentListing);
    }

}
