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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ListingService {

    private final EquipmentListingRepository equipmentListingRepository;
    private final EquipmentCategoryRepository equipmentCategoryRepository;
    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    //private final MerchantService merchantService;

    ListingService(EquipmentListingRepository equipmentListingRepository,
                   EquipmentCategoryRepository equipmentCategoryRepository,
                   UserRepository userRepository,
                   MerchantRepository merchantRepository
    ) {
        this.equipmentListingRepository = equipmentListingRepository;
        this.equipmentCategoryRepository = equipmentCategoryRepository;
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
    }

    public ListingDto equipmentListingToListingDTO(EquipmentListing listing) {
        ListingDto dto = new ListingDto();

        dto.setId(listing.getListingId());
        dto.setMerchantID(listing.getMerchant().getId());
        dto.setCategoryName(listing.getCategory().getName());
        dto.setTitle(listing.getTitle());
        dto.setDescription(listing.getDescription());
        dto.setDailyPrice(listing.getDailyPrice());
        dto.setDepositAmount(listing.getDepositAmount());
        dto.setCurrency(listing.getCurrency());
        dto.setAvailableFrom(listing.getAvailableFrom());
        dto.setAvailableUntil(listing.getAvailableUntil());
        dto.setQuantityAvailable(listing.getQuantityAvailable());
        dto.setIsActive(listing.getIsActive());


        dto.setPickupAddress(listing.getPickupAddress());
        dto.setPickupArea(listing.getPickupArea());
        dto.setPickupCity(listing.getPickupCity());
        dto.setPickupPostalCode(listing.getPickupPostalCode());
        dto.setPickupCountry(listing.getPickupCountry());
        dto.setPickupLatitude(listing.getPickupLatitude());
        dto.setPickupLongitude(listing.getPickupLongitude());

        dto.setReturnAddress(listing.getReturnAddress());
        dto.setReturnArea(listing.getReturnArea());
        dto.setReturnCity(listing.getReturnCity());
        dto.setReturnPostalCode(listing.getReturnPostalCode());
        dto.setReturnCountry(listing.getReturnCountry());
        dto.setReturnLatitude(listing.getReturnLatitude());
        dto.setReturnLongitude(listing.getReturnLongitude());

        return dto;
    }

    public List<ListingDto> allListings(){

        List<EquipmentListing> listings = equipmentListingRepository.findAll();

        List<ListingDto> response = new java.util.ArrayList<>(List.of());

        for(EquipmentListing listing : listings){
            response.add(equipmentListingToListingDTO(listing));
        }
        return response;
    }


    public List<EquipmentCategory> allCategories(){
        return equipmentCategoryRepository.findAll();
    }


    public List<ListingDto> getListingsByMerchantUsername(String username){

        UserEntity user = userRepository.findByUsername(username);
        Optional<Merchant> merchant = merchantRepository.findMerchantByUserId(user.getId());

        if (merchant.isEmpty()){
            return null;
        }
        Optional<List<EquipmentListing>> lista = equipmentListingRepository.findEquipmentListingByMerchant(merchant.get());

        if(!lista.isPresent()){
            return List.of();
        }

        List<ListingDto> response = new java.util.ArrayList<>(List.of());



        for(EquipmentListing listing : lista.get()){
            response.add(equipmentListingToListingDTO(listing));
        }
        return response;
    }

    public List<ListingDto> allListingsByCategory(String category){

        EquipmentCategory equipmentCategory = equipmentCategoryRepository.findEquipmentCategoryByName(category)
                .orElseGet(()-> {return null;});

        if(equipmentCategory == null){return  List.of();}

        Optional<List<EquipmentListing>> lista = equipmentListingRepository.findEquipmentListingByCategory(equipmentCategory);

        if (!lista.isPresent()) {
            return  List.of();
        }

        List<ListingDto> response = new java.util.ArrayList<>(List.of());

        for(EquipmentListing listing : lista.get()){
            response.add(equipmentListingToListingDTO(listing));
        }
        return response;

        //return equipmentListingRepository.findEquipmentListingByCategory(equipmentCategory)
        //        .orElseGet(()-> {return null; });//mozda bi se trebalo zamijenit s praznom listom
    }



    public List<ListingDto> filterMerchantsEquipment( String merchantUsername,
                                                  String categoryName,
                                                  BigDecimal maxDailyPrice,
                                                  String currency
                                                  ){
        //List<ListingDto> lista = getListingsByMerchantUsername(merchantUsername);
        Merchant merchant = merchantRepository.getMerchantsByUser(userRepository.findByUsername(merchantUsername));

        Specification<EquipmentListing> spec = hasMerchant(merchant);

        spec = spec.and(allFiltersPossible(categoryName, maxDailyPrice, currency, null));

        if(spec==null){
            return List.of();
        }


        List<ListingDto> lista = new java.util.ArrayList<>(List.of());
        for(EquipmentListing listing : equipmentListingRepository.findAll(spec) ){
            lista.add(equipmentListingToListingDTO(listing));
        }

        return lista;
    }

    public List<ListingDto> allEquipmentFilteredIfPossible(String categoryName,
                                                           BigDecimal maxDailyPrice,
                                                           String currency,
                                                           Long merchandID){


        Specification<EquipmentListing> spec = Specification.allOf();

        spec = spec.and(allFiltersPossible(categoryName, maxDailyPrice, currency, merchandID));

        if(spec==null){
            return List.of();
        }


        List<ListingDto> lista = new java.util.ArrayList<>(List.of());
        for(EquipmentListing listing : equipmentListingRepository.findAll(spec) ){
            lista.add(equipmentListingToListingDTO(listing));
        }

        return lista;

    }

    public Specification<EquipmentListing> allFiltersPossible(String categoryName,
                                                              BigDecimal maxDailyPrice,
                                                              String currency,
                                                              Long merchandID){

        Specification<EquipmentListing> spec = Specification.allOf();

        if(categoryName != null){
            Optional<EquipmentCategory> category = equipmentCategoryRepository.findEquipmentCategoryByName(categoryName);
            if(category.isEmpty()){
                return null;
            }
            spec = spec.and(hasCategory(category.get()));
        }
        if(merchandID != null){
            Merchant merchant = merchantRepository.findMerchantByid(merchandID);

            spec = spec.and(hasMerchant(merchant));
        }

        if(maxDailyPrice != null){
            spec = spec.and(dailyPriceIsLessThan(maxDailyPrice));
        }
        if(currency != null){
            spec = spec.and(hasCurrency(currency));
        }
        return spec;
    }



    public static Specification<EquipmentListing> hasMerchant(Merchant merchant) {
        return (root, query, cb) -> {
            if (merchant == null) {
                return cb.conjunction(); // no-op
            }
            return cb.equal(root.get("merchant"), merchant);
        };
    }

    public static Specification<EquipmentListing> hasCategory(EquipmentCategory category) {
        return (root, query, cb) -> {
            if (category == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("category"), category);
        };
    }

    public static Specification<EquipmentListing> dailyPriceIsLessThan(BigDecimal maxDailyPrice) {
        return (root, query, cb) -> {
            if (maxDailyPrice == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("dailyPrice"), maxDailyPrice);
            //return cb.equal(root.get("listingId"), maxDailyPrice);
        };
    }
    public static Specification<EquipmentListing> hasCurrency(String currency) {
        return (root, query, cb) -> {
            if (currency == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("currency"), currency);
        };
    }

    public ListingDto createListing(ListingDto dto) {

        Merchant merchant = merchantRepository.findById(dto.getMerchantID())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Merchant s ID-om " + dto.getMerchantID() + " ne postoji"));


        EquipmentCategory category = equipmentCategoryRepository.findEquipmentCategoryByName(dto.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("Nepostojeća kategorija"));

        EquipmentListing listing = new EquipmentListing();

        listing.setMerchant(merchant);
        listing.setCategory(category);


        listing.setTitle(dto.getTitle());
        listing.setDescription(dto.getDescription());
        listing.setDailyPrice(dto.getDailyPrice());
        listing.setDepositAmount(dto.getDepositAmount() != null ? dto.getDepositAmount() : BigDecimal.ZERO);
        listing.setCurrency(dto.getCurrency() != null ? dto.getCurrency() : "EUR");
        listing.setAvailableFrom(dto.getAvailableFrom());
        listing.setAvailableUntil(dto.getAvailableUntil());
        listing.setQuantityAvailable(dto.getQuantityAvailable() != null ? dto.getQuantityAvailable() : 1);
        listing.setIsActive(true);


        listing.setPickupAddress(dto.getPickupAddress());
        listing.setPickupArea(dto.getPickupArea());
        listing.setPickupCity(dto.getPickupCity());
        listing.setPickupPostalCode(dto.getPickupPostalCode());
        listing.setPickupCountry(dto.getPickupCountry() != null ? dto.getPickupCountry() : "Croatia");


        listing.setReturnAddress(dto.getReturnAddress());
        listing.setReturnArea(dto.getReturnArea());
        listing.setReturnCity(dto.getReturnCity());
        listing.setReturnPostalCode(dto.getReturnPostalCode());
        listing.setReturnCountry(dto.getReturnCountry() != null ? dto.getReturnCountry() : "Croatia");



        EquipmentListing saved = equipmentListingRepository.save(listing);
        return equipmentListingToListingDTO(saved);
    }

}
