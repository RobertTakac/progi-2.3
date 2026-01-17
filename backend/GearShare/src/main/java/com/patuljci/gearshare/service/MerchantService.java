package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.dto.NewListingDto;
import com.patuljci.gearshare.model.EquipmentCategory;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.*;
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
    private final ReviewRepository reviewRepository;

    MerchantService (MerchantRepository merchantRepository, UserRepository userRepository, ListingService listingService, EquipmentCategoryRepository equipmentCategoryRepository, EquipmentListingRepository equipmentListingRepository, ReviewRepository reviewRepository) {
        this.merchantRepository = merchantRepository;
        this.userRepository = userRepository;
        this.listingService = listingService;
        this.equipmentCategoryRepository = equipmentCategoryRepository;
        this.equipmentListingRepository = equipmentListingRepository;
        this.reviewRepository = reviewRepository;
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

    public boolean deleteListing(Long listingID){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserEntity user = userRepository.findByUsername(authentication.getName());
        Optional<Merchant> merchantOptional = merchantRepository.findMerchantByUserId(user.getId());

        if(merchantOptional.isEmpty()){
            return false;
        }
        Merchant merchant = merchantOptional.get();

        EquipmentListing listing = equipmentListingRepository.findEquipmentListingBylistingId(listingID);
        if(listing.getMerchant().getId() == merchant.getId()){
            equipmentListingRepository.deleteById(listingID);
            return true;
        }
        return false;
    }

    public ListingDto updateListing(ListingDto listingDto) {
        //String merchant = SecurityContextHolder.getContext().getAuthentication().getName();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserEntity user = userRepository.findByUsername(authentication.getName());
        Optional<Merchant> merchantOptional = merchantRepository.findMerchantByUserId(user.getId());

        if(merchantOptional.isEmpty()){
            System.out.println("User is not a merchant");
            return null;
        }
        Merchant merchant = merchantOptional.get();


        EquipmentListing equipmentListing = equipmentListingRepository.findEquipmentListingBylistingId(listingDto.getId());

        //if (listingDto.getMerchantID() != merchant.getId()){
        if (equipmentListing.getMerchant().getId() != merchant.getId()){
            System.out.println("This merchant is not the owner of the listing");
            return null;
        }

        if(listingDto.getCategoryName() != null) {
            Optional<EquipmentCategory> category = equipmentCategoryRepository.findEquipmentCategoryByName(listingDto.getCategoryName());
            if(category.isPresent()){
                equipmentListing.setCategory(category.get());
            }
        }
        if(listingDto.getTitle()!= null) {
            equipmentListing.setTitle(listingDto.getTitle());
        }
        if(listingDto.getDescription()!= null) {
            equipmentListing.setDescription(listingDto.getDescription());
        }
        if(listingDto.getDailyPrice()!= null) {
            equipmentListing.setDailyPrice(listingDto.getDailyPrice());
        }
        if(listingDto.getDepositAmount()!=null){
            equipmentListing.setDepositAmount(listingDto.getDepositAmount());
        }
        if(listingDto.getCurrency()!=null){
            equipmentListing.setCurrency(listingDto.getCurrency());
        }
        if(listingDto.getAvailableFrom()!=null) {
            equipmentListing.setAvailableFrom(listingDto.getAvailableFrom());
        }
        if(listingDto.getAvailableUntil()!=null) {
            equipmentListing.setAvailableUntil(listingDto.getAvailableUntil());
        }
        if(listingDto.getPickupLocation()!=null) {
            equipmentListing.setPickupLocation(listingDto.getPickupLocation());
        }
        if(listingDto.getReturnLocation()!=null) {
            equipmentListing.setReturnLocation(listingDto.getReturnLocation());
        }
        if(listingDto.getQuantityAvailable()!=null) {
            equipmentListing.setQuantityAvailable(listingDto.getQuantityAvailable());
        }
        if(listingDto.getIsActive()!=null) {
            equipmentListing.setIsActive(listingDto.getIsActive());
        }

        return listingService.equipmentListingToListingDTO(equipmentListingRepository.save(equipmentListing));
    }

    public ListingDto addListing(Merchant merchant, NewListingDto newListingDto){

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

        ListingDto listingDto = new ListingDto();

        //listingDto.setCategory(category.get());
        listingDto.setCategoryName(newListingDto.getCategoryName());
        listingDto.setTitle(newListingDto.getTitle());
        listingDto.setDescription(newListingDto.getDescription());
        listingDto.setDailyPrice(newListingDto.getDailyPrice());
        listingDto.setDepositAmount(newListingDto.getDepositAmount());
        listingDto.setCurrency(newListingDto.getCurrency());
        listingDto.setAvailableFrom(newListingDto.getAvailableFrom());
        listingDto.setAvailableUntil(newListingDto.getAvailableUntil());
        listingDto.setPickupLocation(newListingDto.getPickupLocation());
        listingDto.setReturnLocation(newListingDto.getReturnLocation());
        listingDto.setIsActive(newListingDto.getIsActive());

        //newListingDto.setEmail(merchant.getUser().getEmail());
        return listingDto;
    }

    public Merchant updateMerchantRating(Merchant merchant){



        return merchant;
    }

}
