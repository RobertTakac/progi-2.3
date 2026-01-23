package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.*;
import com.patuljci.gearshare.model.ListingImage;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RequestMapping("/merchant")
@RestController
public class MerchantController {

    private final ListingService listingService;
    private final MerchantService  merchantService;
    private final ReservationService reservationService;
    private final ReportService reportService;
    private final ImageService imageService;

    MerchantController(ListingService listingService, MerchantService merchantService, ReservationService reservationService, ReportService reportService, ImageService imageService) {
        this.listingService = listingService;
        this.merchantService = merchantService;
        this.reservationService = reservationService;
        this.reportService = reportService;
        this.imageService = imageService;
    }


    @DeleteMapping(value="/deleteListing/{listingID}")
    public ResponseEntity<String> deleteListing(@PathVariable Long listingID) {

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
                                                                         @RequestParam(required = false) Long listingID,
                                                                         @RequestParam(required=false) String status){

        return ResponseEntity.ok(reservationService.getReservationsOfMyListings(category, listingID, status));
    }


    @PostMapping(value="/report-user")
    public ResponseEntity<ReportDTO> reportUser(@RequestBody ReportDTO reportDTO){
        return ResponseEntity.ok(reportService.createNewReport(reportDTO));
    }


    @PostMapping(value = "/upload-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadListingImage(
            @RequestPart("file") MultipartFile file,
            @RequestParam("listingID") Long listingID
    ) {
        if (file == null || file.isEmpty()) {
            System.out.println("Received empty file for listingID: " + listingID);
            return ResponseEntity.badRequest().body("No file received or file is empty");
        }
        try {
            ListingImage image = imageService.addListingImage(file, listingID);
            if (image == null) {
                return ResponseEntity.badRequest().body("Failed to save image (ownership or listing issue)");
            }
            return ResponseEntity.ok(image);
        } catch (Exception e) {
            System.err.println("Upload failed: " + e.getMessage());
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }


    @PostMapping(value="/update-info")
    public ResponseEntity<UserDTO> updateInfo(@RequestBody MerchantRegisterDTO dto){
        merchantService.updateMerchantInfo(dto);
        return  ResponseEntity.ok().build();
    }

    @PostMapping(value="/approve")
    public ResponseEntity<String> approveReservation(@RequestParam Long reservationID){
        return ResponseEntity.ok(reservationService.approveReservation(reservationID));
    }

    @PostMapping(value="/disapprove")
    public ResponseEntity<String> disapproveReservation(@RequestParam Long reservationID){
        return ResponseEntity.ok(reservationService.disapproveReservation(reservationID));
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
