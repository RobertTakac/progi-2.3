package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.EquipmentCategory;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class MerchantService {

    private final MerchantRepository merchantRepository;
    private final UserRepository userRepository;
    private final ListingService listingService;
    private final EquipmentCategoryRepository equipmentCategoryRepository;
    private final EquipmentListingRepository equipmentListingRepository;
    private final ReviewRepository reviewRepository;
    private final ImageStorageService imgService;

    MerchantService (MerchantRepository merchantRepository, UserRepository userRepository, ListingService listingService, EquipmentCategoryRepository equipmentCategoryRepository, EquipmentListingRepository equipmentListingRepository, ReviewRepository reviewRepository, ImageStorageService imgService) {
        this.merchantRepository = merchantRepository;
        this.userRepository = userRepository;
        this.listingService = listingService;
        this.equipmentCategoryRepository = equipmentCategoryRepository;
        this.equipmentListingRepository = equipmentListingRepository;
        this.reviewRepository = reviewRepository;
        this.imgService = imgService;
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
        if(listing == null || !listing.getMerchant().getId().equals(merchant.getId())) {
            return false;
        }

        equipmentListingRepository.deleteById(listingID);
        return true;
    }

    public ListingDto updateListing(ListingDto listingDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = userRepository.findByUsername(authentication.getName());

        Optional<Merchant> merchantOptional = merchantRepository.findMerchantByUserId(user.getId());
        if (merchantOptional.isEmpty()) {
            System.out.println("User is not a merhant");
            return null;
        }
        Merchant merchant = merchantOptional.get();

        EquipmentListing equipmentListing = equipmentListingRepository.findEquipmentListingBylistingId(listingDto.getId());
        if (equipmentListing == null) {
            System.out.println("not found");
            return null;
        }


        if (!equipmentListing.getMerchant().getId().equals(merchant.getId())) {
            System.out.println("not the owner of the listing");
            return null;
        }


        if (listingDto.getCategoryName() != null) {
            Optional<EquipmentCategory> category = equipmentCategoryRepository.findEquipmentCategoryByName(listingDto.getCategoryName());
            category.ifPresent(equipmentListing::setCategory);
        }

        if (listingDto.getTitle() != null) {
            equipmentListing.setTitle(listingDto.getTitle());
        }
        if (listingDto.getDescription() != null) {
            equipmentListing.setDescription(listingDto.getDescription());
        }
        if (listingDto.getDailyPrice() != null) {
            equipmentListing.setDailyPrice(listingDto.getDailyPrice());
        }
        if (listingDto.getDepositAmount() != null) {
            equipmentListing.setDepositAmount(listingDto.getDepositAmount());
        }
        if (listingDto.getCurrency() != null) {
            equipmentListing.setCurrency(listingDto.getCurrency());
        }
        if (listingDto.getAvailableFrom() != null) {
            equipmentListing.setAvailableFrom(listingDto.getAvailableFrom());
        }
        if (listingDto.getAvailableUntil() != null) {
            equipmentListing.setAvailableUntil(listingDto.getAvailableUntil());
        }
        if (listingDto.getQuantityAvailable() != null) {
            equipmentListing.setQuantityAvailable(listingDto.getQuantityAvailable());
        }
        if (listingDto.getIsActive() != null) {
            equipmentListing.setIsActive(listingDto.getIsActive());
        }


        if (listingDto.getPickupAddress() != null)
            equipmentListing.setPickupAddress(listingDto.getPickupAddress());
        if (listingDto.getPickupArea() != null)
            equipmentListing.setPickupArea(listingDto.getPickupArea());
        if (listingDto.getPickupCity() != null)
            equipmentListing.setPickupCity(listingDto.getPickupCity());
        if (listingDto.getPickupPostalCode() != null)
            equipmentListing.setPickupPostalCode(listingDto.getPickupPostalCode());
        if (listingDto.getPickupCountry() != null)
            equipmentListing.setPickupCountry(listingDto.getPickupCountry());


        if (listingDto.getReturnAddress() != null)
            equipmentListing.setReturnAddress(listingDto.getReturnAddress());
        if (listingDto.getReturnArea() != null)
            equipmentListing.setReturnArea(listingDto.getReturnArea());
        if (listingDto.getReturnCity() != null)
            equipmentListing.setReturnCity(listingDto.getReturnCity());
        if (listingDto.getReturnPostalCode() != null)
            equipmentListing.setReturnPostalCode(listingDto.getReturnPostalCode());
        if (listingDto.getReturnCountry() != null)
            equipmentListing.setReturnCountry(listingDto.getReturnCountry());


        EquipmentListing updated = equipmentListingRepository.save(equipmentListing);


        return listingService.equipmentListingToListingDTO(updated);
    }

    public ListingDto addListing(Merchant merchant, ListingDto newListingDto, MultipartFile img) {

        EquipmentListing listing = new EquipmentListing();
        listing.setMerchant(merchant);

        Optional<EquipmentCategory> category = equipmentCategoryRepository.findEquipmentCategoryByName(newListingDto.getCategoryName());
        if(category.isEmpty()) {
            throw new IllegalArgumentException("Category not found " + newListingDto.getCategoryName());
        }

        listing.setCategory(category.get());
        
        listing.setTitle(newListingDto.getTitle());
        listing.setDescription(newListingDto.getDescription());
        listing.setDailyPrice(newListingDto.getDailyPrice());
        listing.setDepositAmount(newListingDto.getDepositAmount());
        listing.setCurrency(newListingDto.getCurrency());
        listing.setAvailableFrom(newListingDto.getAvailableFrom());
        listing.setAvailableUntil(newListingDto.getAvailableUntil());
        listing.setQuantityAvailable(newListingDto.getQuantityAvailable());
        listing.setIsActive(newListingDto.getIsActive() != null ? newListingDto.getIsActive() : true);

        listing.setPickupAddress(newListingDto.getPickupAddress());
        listing.setPickupArea(newListingDto.getPickupArea());
        listing.setPickupCity(newListingDto.getPickupCity());
        listing.setPickupPostalCode(newListingDto.getPickupPostalCode());
        listing.setPickupCountry(newListingDto.getPickupCountry() != null ? newListingDto.getPickupCountry() : "Croatia");

        listing.setReturnAddress(newListingDto.getReturnAddress());
        listing.setReturnArea(newListingDto.getReturnArea());
        listing.setReturnCity(newListingDto.getReturnCity());
        listing.setReturnPostalCode(newListingDto.getReturnPostalCode());
        listing.setReturnCountry(newListingDto.getReturnCountry() != null ? newListingDto.getReturnCountry() : "Croatia");

        if (img != null) {
            try {
                listing.setImagePath(imgService.saveImage(img));
            } catch (IOException e) {
                throw new IllegalArgumentException("Image saving failed!");
            }
        }

        EquipmentListing saved = equipmentListingRepository.save(listing);
        ListingDto listingDto = new ListingDto();

        listingDto.setId(saved.getListingId());
        listingDto.setMerchantID(merchant.getId());
        listingDto.setCategoryName(newListingDto.getCategoryName());
        listingDto.setTitle(newListingDto.getTitle());
        listingDto.setDescription(newListingDto.getDescription());
        listingDto.setDailyPrice(newListingDto.getDailyPrice());
        listingDto.setDepositAmount(newListingDto.getDepositAmount());
        listingDto.setCurrency(newListingDto.getCurrency());
        listingDto.setAvailableFrom(newListingDto.getAvailableFrom());
        listingDto.setAvailableUntil(newListingDto.getAvailableUntil());
        listingDto.setQuantityAvailable(newListingDto.getQuantityAvailable());
        listingDto.setIsActive(newListingDto.getIsActive());

        listingDto.setPickupAddress(newListingDto.getPickupAddress());
        listingDto.setPickupArea(newListingDto.getPickupArea());
        listingDto.setPickupCity(newListingDto.getPickupCity());
        listingDto.setPickupPostalCode(newListingDto.getPickupPostalCode());
        listingDto.setPickupCountry(newListingDto.getPickupCountry());
        listingDto.setPickupLatitude(saved.getPickupLatitude());
        listingDto.setPickupLongitude(saved.getPickupLongitude());

        listingDto.setReturnAddress(newListingDto.getReturnAddress());
        listingDto.setReturnArea(newListingDto.getReturnArea());
        listingDto.setReturnCity(newListingDto.getReturnCity());
        listingDto.setReturnPostalCode(newListingDto.getReturnPostalCode());
        listingDto.setReturnCountry(newListingDto.getReturnCountry());
        listingDto.setReturnLatitude(saved.getReturnLatitude());
        listingDto.setReturnLongitude(saved.getReturnLongitude());

        return listingDto;
    }

    public Merchant updateMerchantRating(Merchant merchant){



        return merchant;
    }

}
