package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.dto.NewReservationDTO;
import com.patuljci.gearshare.dto.ReservationDTO;
import com.patuljci.gearshare.service.ClientService;
import com.patuljci.gearshare.service.ListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/client")
@RestController
public class ClientController {

    private final ListingService listingService;
    private final ClientService clientService;

    public ClientController(ListingService listingService, ClientService clientService) {
        this.listingService = listingService;
        this.clientService = clientService;
    }

    @GetMapping(value="/get-my-reservations")
    public ResponseEntity<List<ReservationDTO>> getMyReservations(){

        return ResponseEntity.ok(clientService.getClientsReservations());
    }


    @PostMapping(value="/create-reservation")
    public ResponseEntity<ReservationDTO> makeReservation(@RequestBody NewReservationDTO newReservationDTO) {


        return ResponseEntity.ok(clientService.createReservation(newReservationDTO));
    }
}
