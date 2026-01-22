package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.ReservationDTO;
import com.patuljci.gearshare.model.*;
import com.patuljci.gearshare.repository.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    private final EquipmentCategoryRepository equipmentCategoryRepository;
    private final EquipmentListingRepository equipmentListingRepository;
    private final ClientService clientService;


    public ReservationService(ReservationRepository reservationRepository, UserRepository userRepository, MerchantRepository merchantRepository, EquipmentCategoryRepository equipmentCategoryRepository, EquipmentListingRepository equipmentListingRepository, ClientService clientService) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.equipmentCategoryRepository = equipmentCategoryRepository;
        this.equipmentListingRepository = equipmentListingRepository;
        this.clientService = clientService;
    }


    public List<ReservationDTO> getReservationsOfMyListings(String category, Long listingID){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserEntity user = userRepository.findByUsername(authentication.getName());
        Merchant merchant = merchantRepository.findMerchantByUserId(user.getId()).orElse(null);

        Specification spec = hasMerchant(merchant);
        spec = spec.and(allReservationFilters(category, listingID));
        if(spec==null){
            return List.of();
        }
        List<Reservation> lista = reservationRepository.findAll(spec);
        List<ReservationDTO> dtoList = new ArrayList<>();
        for(Reservation res : lista){
            dtoList.add(clientService.reservationToDTO(res));
        }
        return dtoList;
    }

    public Specification<Reservation> allReservationFilters(String categoryName, Long listingID){

        Specification<Reservation> spec = Specification.allOf();

        if(categoryName != null){
            Optional<EquipmentCategory> category = equipmentCategoryRepository.findEquipmentCategoryByName(categoryName);
            if(category.isEmpty()){
                return null;
            }
            spec = spec.and(hasCategory(category.get()));
        }
        if(listingID != null){
            EquipmentListing equipmentListing = equipmentListingRepository.findEquipmentListingBylistingId(listingID);
            if(equipmentListing == null){
                return null;
            }

            spec = spec.and(hasListing(equipmentListing));
        }


        return spec;

    }


    public static Specification<Reservation> hasMerchant(Merchant merchant) {
        return (root, query, cb) -> {
            if (merchant == null) {
                return cb.conjunction(); // no-op
            }
            return cb.equal(root.get("merchant"), merchant);
        };
    }

    public static Specification<Reservation> hasCategory(EquipmentCategory category) {
        return (root, query, cb) -> {
            if (category == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("category"), category);
        };
    }

    public static Specification<Reservation> hasListing(EquipmentListing listing) {
        return (root, query, cb) -> {
            if (listing == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("equipmentListing"), listing);
        };
    }

    public String approveReservation(Long reservationID){
        Reservation reservation = reservationRepository.findReservationById(reservationID);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = userRepository.findByUsername(authentication.getName());
        Merchant merchant = merchantRepository.findMerchantByUserId(user.getId()).orElse(null);
        if(merchant.getId() != reservation.getEquipmentListing().getMerchant().getId()){
            return "This reservations equipment doesnt belong to this merchant";
        }

        reservation.setStatus("ACTIVE");

        reservationRepository.save(reservation);


        return "Reservation approved";
    }

    public String disapproveReservation(Long reservationID){
        Reservation reservation = reservationRepository.findReservationById(reservationID);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserEntity user = userRepository.findByUsername(authentication.getName());
        Merchant merchant = merchantRepository.findMerchantByUserId(user.getId()).orElse(null);
        if(merchant.getId() != reservation.getEquipmentListing().getMerchant().getId()){
            return "This reservations equipment doesnt belong to this merchant";
        }
        
        reservationRepository.delete(reservation);

        return "Reservation deleted";
    }


}
