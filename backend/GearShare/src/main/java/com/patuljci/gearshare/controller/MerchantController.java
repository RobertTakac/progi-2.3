package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.service.ListingService;
import com.patuljci.gearshare.service.MerchantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequestMapping("/merchant")
@RestController
public class MerchantController {

    private final ListingService listingService;
    private final MerchantService  merchantService;

    MerchantController(ListingService listingService, MerchantService merchantService) {
        this.listingService = listingService;
        this.merchantService = merchantService;
    }



    @PostMapping(value="createListing")
    public ResponseEntity<ListingDto> createListing(ListingDto dto){



        Optional<Merchant> merchant = merchantService.optionalMerchant();
        if (!merchant.isPresent()) {
            return  ResponseEntity.notFound().build();
        }
        System.out.println(merchant.get().getBusinessName());

        ListingDto listingDto = merchantService.addListing(merchant.get(), dto);

        return ResponseEntity.ok(listingDto);
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


    @GetMapping("/test")
    public ResponseEntity<String> testing(){

        return ResponseEntity.ok("ok");
    }

}
