package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.service.ListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/merchant")
@RestController
public class MerchantController {

    private final ListingService listingService;

    MerchantController(ListingService listingService) {
        this.listingService = listingService;
    }

    /*
    @PostMapping("/add")
    public ResponseEntity<String> createMerchant(@RequestBody Merchant merchant, @AuthenticationPrincipal OAuth2User oauthUser) {



        return ResponseEntity.ok().body("success");
    }

    @GetMapping("")
    public String getAllMerchants() {
        return "ekskluzivni sadrzaj";
    } */


    @PostMapping("/createListing")
    public ResponseEntity<EquipmentListing> createListing(@RequestBody ListingDto listingDto) {

        EquipmentListing equipmentListing = listingService.createListing(listingDto);

        if (equipmentListing==null) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok(equipmentListing);
    }

}
