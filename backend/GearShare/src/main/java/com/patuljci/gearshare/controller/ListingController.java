package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.EquipmentCategory;
import com.patuljci.gearshare.service.ImageService;
import com.patuljci.gearshare.service.ListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RequestMapping("/listing")
@RestController
public class ListingController {

    private final ListingService listingService;
    private final ImageService imageService;

    ListingController(ListingService listingService, ImageService imageService) {
        this.listingService = listingService;
        this.imageService = imageService;
    }

    /// DOHVATI SVE KATEGORIJE
    @GetMapping("/categories")
    public ResponseEntity<List<EquipmentCategory>> allCategories(){

        //System.out.println("trazim kategorije");

        return ResponseEntity.ok(listingService.allCategories());

    }

    /// DOHVATI SVE OGLASE
    @GetMapping("/all")
    public ResponseEntity<List<ListingDto>> getListing(){

        return ResponseEntity.ok(listingService.allListings());
    }

    /// DOHVATI SVE OGLASE ALI IH FILTRIRAJ AKO SU FILTERI DODANI
    @GetMapping("/")
    public ResponseEntity<List<ListingDto>> getListingAndFilterMaybe(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal maxDailyPrice,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) Long merchantID,
            @RequestParam(required = false) String keyword){

        return ResponseEntity.ok(listingService.allEquipmentFilteredIfPossible(category, maxDailyPrice, currency, merchantID, keyword));
    }


    /// DOHVATI SVE OGLASE U NEKOJ KATEGORIJI
    @GetMapping(value = "/categories/{category}")//, params = {"categoryName"})
    public ResponseEntity<List<ListingDto>> getListing(@PathVariable String category){

        return ResponseEntity.ok(listingService.allListingsByCategory(category));
    }



    /// DOHVATI SVE OGLASE NEKOG MERCHANTA I FILTRIRAJ IH AKO MOZES
    @GetMapping(value="/merchant/{merchantUsername}")
    public ResponseEntity<List<ListingDto>> getListingByMerchantAndFilter(
            @PathVariable String merchantUsername,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal maxDailyPrice,
            @RequestParam(required = false) String currency,
            @RequestParam(required = false) String keyword){

        return ResponseEntity.ok(listingService.filterMerchantsEquipment(merchantUsername,category, maxDailyPrice, currency));
    }

    @PostMapping
    public ListingDto createListing(@RequestBody ListingDto newListing) {
        return listingService.createListing(newListing);
    }


    @GetMapping(value="/get-image")
    public ResponseEntity<byte[]> getImage(@RequestParam Long  listingID){
        return ResponseEntity.ok(imageService.getImage(listingID));
    }



}
