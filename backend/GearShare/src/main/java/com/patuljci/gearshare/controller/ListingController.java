package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.dto.NewListingDto;
import com.patuljci.gearshare.model.EquipmentCategory;
import com.patuljci.gearshare.service.ListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RequestMapping("/listing")
@RestController
public class ListingController {

    private ListingService listingService;

    ListingController(ListingService listingService) {
        this.listingService = listingService;
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
            @RequestParam(required = false) Long merchantID){

        return ResponseEntity.ok(listingService.allEquipmentFilteredIfPossible(category, maxDailyPrice, currency, merchantID));
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
            @RequestParam(required = false) String currency
            ){

        return ResponseEntity.ok(listingService.filterMerchantsEquipment(merchantUsername,category, maxDailyPrice, currency));
    }

}
