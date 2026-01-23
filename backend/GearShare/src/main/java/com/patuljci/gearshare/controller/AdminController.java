package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ReportDTO;
import com.patuljci.gearshare.dto.ClientDataDTO;
import com.patuljci.gearshare.service.ReportService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.patuljci.gearshare.dto.EquipmentCategoryDTO;
import com.patuljci.gearshare.service.ClientService;
import com.patuljci.gearshare.service.ListingService;

@RequestMapping("/admin")
@RestController
public class AdminController {

    private final ReportService reportService;
    private final ListingService listingService;
    private final ClientService clientService;

    public AdminController(ReportService reportService, ListingService listingService, ClientService clientService) {
        this.reportService = reportService;
        this.listingService = listingService;
        this.clientService = clientService;
    }

    @GetMapping(value = "/get-reports")
    public ResponseEntity<List<ReportDTO>> getReports() {
        return ResponseEntity.ok(reportService.getALlReports());
    }

    @GetMapping(value = "/ban-user")
    public ResponseEntity<String> banUser(@RequestParam Long clientID) {
        return ResponseEntity.ok(reportService.banUser(clientID));
    }
    
    @GetMapping(value = "/all-clients")
    public ResponseEntity<List<ClientDataDTO>> allClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @PostMapping("/categories")
    public ResponseEntity<EquipmentCategoryDTO> newCategory(@RequestBody EquipmentCategoryDTO categoryDto) {
        return ResponseEntity.ok(listingService.createCategory(categoryDto));
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long categoryId) {
        listingService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

}
