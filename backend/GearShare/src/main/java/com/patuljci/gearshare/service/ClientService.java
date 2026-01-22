package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.NewReservationDTO;
import com.patuljci.gearshare.dto.ReservationDTO;
import com.patuljci.gearshare.model.Client;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Reservation;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.ClientRepository;
import com.patuljci.gearshare.repository.EquipmentListingRepository;
import com.patuljci.gearshare.repository.ReservationRepository;
import com.patuljci.gearshare.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientService {

    private final EquipmentListingRepository equipmentListingRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final ListingService listingService;
    //private final ReservationService reservationService;


    public ClientService(EquipmentListingRepository equipmentListingRepository,
                         ReservationRepository reservationRepository, UserRepository userRepository,
                         ClientRepository clientRepository, ListingService listingService) {
        this.equipmentListingRepository = equipmentListingRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.listingService = listingService;
        //this.reservationService = reservationService;
    }

    public ReservationDTO createReservation(NewReservationDTO newReservationDTO) {

        String clientUser = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(clientUser);
        Client client = clientRepository.findClientByUserId(user.getId()).orElse(null);

        EquipmentListing equipmentListing = equipmentListingRepository.findEquipmentListingBylistingId(newReservationDTO.getListingID());

        Reservation reservation = new Reservation();

        reservation.setClient(client);
        reservation.setEquipmentListing(equipmentListing);
        reservation.setStartDate(newReservationDTO.getStartDate());
        reservation.setEndDate(newReservationDTO.getEndDate());
        reservation.setQuantity(newReservationDTO.getQuantity());

        Reservation res = reservationRepository.save(reservation);
        return reservationToDTO(res);
    }

    public List<ReservationDTO> getClientsReservations(){
        String clientUser = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(clientUser);
        Client client = clientRepository.findClientByUserId(user.getId()).orElse(null);

        List<Reservation> lista = reservationRepository.findReservationByClient(client);

        List<ReservationDTO> response = new ArrayList<>();
        for (Reservation reservation : lista) {
            response.add(reservationToDTO(reservation));
        }

        return response;
    }



    public ReservationDTO reservationToDTO(Reservation reservation){
        ReservationDTO dto = new ReservationDTO();

        dto.setReservationID(reservation.getId());
        dto.setMerchantUsername(reservation.getEquipmentListing().getMerchant().getUser().getUsername());
        dto.setClientUsername(reservation.getClient().getUser().getUsername());

        dto.setListing(listingService.equipmentListingToListingDTO(reservation.getEquipmentListing()));
        dto.setListingID(dto.getListing().getId());
        dto.setStartDate(reservation.getStartDate());
        dto.setEndDate(reservation.getEndDate());
        dto.setQuantity(reservation.getQuantity());
        dto.setStatus(reservation.getStatus());

        return dto;
    }


}
