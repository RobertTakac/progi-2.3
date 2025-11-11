package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.User;
import com.patuljci.gearshare.service.ListingService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/listing")
@RestController
public class ListingController {

    private ListingService listingService;

    ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping("/GetListing")

    @PostMapping("/createListing")
    public void createListing(@RequestBody ListingDto listingDto) {

        listingService.createListing(listingDto);
    }

}
