package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.User;
import com.patuljci.gearshare.service.ListingService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/listing")
@RestController
public class ListingController {

    private ListingService listingService;

    ListingController(ListingService listingService) {
        this.listingService = listingService;
    }


    @PostMapping("/createListing")
    public void createListing(@RequestBody ListingDto listingDto) {

        listingService.createListing(listingDto);
    }

}
