package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.EquipmentCategory;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.service.ListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/listing")
@RestController
public class ListingController {

    private ListingService listingService;

    ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<EquipmentCategory>> allCategories(){

        System.out.println("trazim kategorije");

        return ResponseEntity.ok(listingService.allCategories());

    }


    @GetMapping("/getListing")
    public ResponseEntity<List<ListingDto>> getListing(){

        return ResponseEntity.ok(listingService.allListings());
    }

    @GetMapping(value = "/getListing", params = {"categoryName"})
    public ResponseEntity<List<ListingDto>> getListing(@RequestParam String categoryName){

        return ResponseEntity.ok(listingService.allListingsByCategory(categoryName));
    }

    @PostMapping("/createListing")
    public ResponseEntity<ListingDto> createListing(@AuthenticationPrincipal UserEntity user){

        System.out.println("trazim listinge nove");

        //User korisnik = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println("korisnik: " + user);

        return ResponseEntity.ok(new ListingDto());

    }
    /*
    @GetMapping(value="/createListing")
    public ResponseEntity<ListingDto> createListing(){//Authentication authentication){//,@RequestBody ListingDto dto){

        System.out.println("Usao sam ovdje");
        //User korisnik = (User) authentication.getPrincipal();

        //System.out.println(korisnik.getUsername());

        ListingDto dto = new ListingDto();
        dto.setEmail("nesto barem");

        return ResponseEntity.ok(dto);
    } */

}
