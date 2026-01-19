package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.dto.ReportDTO;
import com.patuljci.gearshare.dto.ReservationDTO;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.service.ListingService;
import com.patuljci.gearshare.service.MerchantService;
import com.patuljci.gearshare.service.ReportService;
import com.patuljci.gearshare.service.ReservationService;
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
    private final ReservationService reservationService;
    private final ReportService reportService;

    MerchantController(ListingService listingService, MerchantService merchantService, ReservationService reservationService, ReportService reportService) {
        this.listingService = listingService;
        this.merchantService = merchantService;
        this.reservationService = reservationService;
        this.reportService = reportService;
    }


    @DeleteMapping(value="/deleteListing/{listingID}")
    public ResponseEntity<String> deleteListing(@RequestParam Long listingID) {

        System.out.println(merchantService.deleteListing(listingID));

        return ResponseEntity.ok("Listing is deleted");
    }

    @PostMapping(value="/updateListing")
    public ResponseEntity<ListingDto> updateListing(@RequestBody ListingDto listingDto) {

        System.out.println(listingDto.getTitle());
        System.out.println(listingDto.getDescription());

        //return ResponseEntity.ok(listingDto);

        return ResponseEntity.ok(merchantService.updateListing(listingDto));
    }

    @GetMapping(value="/get-all-listings")
    public ResponseEntity<List<ListingDto>> getListingsFromMerchant(){

        String merchant = SecurityContextHolder.getContext().getAuthentication().getName();

        return ResponseEntity.ok(listingService.getListingsByMerchantUsername(merchant));
    }

    @PostMapping(value="/create-listing")
    public ResponseEntity<ListingDto> createListing(@RequestBody ListingDto dto){


        Optional<Merchant> merchant = merchantService.optionalMerchant();
        if (!merchant.isPresent()) {
            return  ResponseEntity.notFound().build();
        }
        //System.out.println(merchant.get().getBusinessName());

        ListingDto newListingDto = merchantService.addListing(merchant.get(), dto);

        return ResponseEntity.ok(newListingDto);
    }

    @GetMapping(value="/reservations")
    public ResponseEntity<List<ReservationDTO>> getMerchantsReservations(@RequestParam(required = false) String category,
                                                                         @RequestParam(required = false) Long listingID){

        return ResponseEntity.ok(reservationService.getReservationsOfMyListings(category, listingID));
    }


    @PostMapping(value="/report-user")
    public ResponseEntity<ReportDTO> reportUser(@RequestBody ReportDTO reportDTO){
        return ResponseEntity.ok(reportService.createNewReport(reportDTO));
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
    @PostMapping(value="/testCategory", params = {"categoryName"})
    public ResponseEntity<String> testCategory(@RequestParam String categoryName){

        if(merchantService.test(categoryName)){
            return ResponseEntity.ok("postoji kategorija");
        }
        return ResponseEntity.ok("ne postoji kategorija");
    }
}
