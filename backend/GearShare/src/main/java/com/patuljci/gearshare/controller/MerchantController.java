package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.dto.NewListingDto;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.service.ListingService;
import com.patuljci.gearshare.service.MerchantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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


    @PostMapping(value="/testCategory", params = {"categoryName"})
    public ResponseEntity<String> testCategory(@RequestParam String categoryName){

        if(merchantService.test(categoryName)){
            return ResponseEntity.ok("postoji kategorija");
        }
        return ResponseEntity.ok("ne postoji kategorija");
    }

    @GetMapping(value="getListing")
    public ResponseEntity<List<ListingDto>> getListingsFromMerchant(){

        String merchant = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(listingService.getListingsByMerchantUsername(merchant));
    }

    @PostMapping(value="createListing")
    public ResponseEntity<NewListingDto> createListing(@RequestBody NewListingDto dto){


        Optional<Merchant> merchant = merchantService.optionalMerchant();
        if (!merchant.isPresent()) {
            return  ResponseEntity.notFound().build();
        }
        //System.out.println(merchant.get().getBusinessName());

        NewListingDto newListingDto = merchantService.addListing(merchant.get(), dto);

        return ResponseEntity.ok(newListingDto);
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
