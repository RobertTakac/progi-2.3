package com.patuljci.gearshare.controller;

import com.patuljci.gearshare.dto.ReportDTO;
import com.patuljci.gearshare.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/admin")
@RestController
public class AdminController {

    private final ReportService reportService;

    public AdminController(ReportService reportService) {
        this.reportService = reportService;
    }


    @GetMapping(value="/get-reports")
    public ResponseEntity<List<ReportDTO>> getReports(){
        return ResponseEntity.ok(reportService.getALlReports());
    }

    @GetMapping(value="/ban-user")
    public ResponseEntity<String> banUser(@RequestParam Long clientID){
        return ResponseEntity.ok(reportService.banUser(clientID));
    }

    @PostMapping(value="/ban-user-by-reservation")
    public ResponseEntity<String> banUserByReservation(@RequestParam Long reservationID){
        return ResponseEntity.ok(reportService.banUserByReservationID(reservationID));
    }

    @PostMapping(value="/delete-report")
    public ResponseEntity<String>  deleteReport(@RequestParam Long reportID){
        return ResponseEntity.ok(reportService.deleteReport(reportID));
    }

}
