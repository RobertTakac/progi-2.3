package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.*;
import com.patuljci.gearshare.service.ClientService;
import com.patuljci.gearshare.service.ListingService;
import com.patuljci.gearshare.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/client")
@RestController
public class ClientController {

    private final ListingService listingService;
    private final ClientService clientService;
    private final ReviewService reviewService;

    public ClientController(ListingService listingService, ClientService clientService, ReviewService reviewService) {
        this.listingService = listingService;
        this.clientService = clientService;
        this.reviewService = reviewService;
    }

    @GetMapping(value="/get-my-reservations")
    public ResponseEntity<List<ReservationDTO>> getMyReservations(){

        return ResponseEntity.ok(clientService.getClientsReservations());
    }


    @PostMapping(value="/create-reservation")
    public ResponseEntity<ReservationDTO> makeReservation(@RequestBody NewReservationDTO newReservationDTO) {


        return ResponseEntity.ok(clientService.createReservation(newReservationDTO));
    }


    @PostMapping(value="/rate-merchant")
    public ResponseEntity<ReviewDTO> rateTheMerchant(@RequestBody NewReviewDTO newReviewDTO) {
        return ResponseEntity.ok(reviewService.addReview(newReviewDTO));
    }
}
