package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.ReportDTO;
import com.patuljci.gearshare.model.*;
import com.patuljci.gearshare.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    private final ClientRepository clientRepository;
    private final ReservationRepository reservationRepository;
    private final ReportRepository reportRepository;
    private final UserService userService;

    public ReportService(UserRepository userRepository, MerchantRepository merchantRepository, ClientRepository clientRepository, ReservationRepository reservationRepository, ReportRepository reportRepository, UserService userService) {
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.clientRepository = clientRepository;
        this.reservationRepository = reservationRepository;
        this.reportRepository = reportRepository;
        this.userService = userService;
    }


    public ReportDTO createNewReport(ReportDTO reportDTO){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        UserEntity user = userRepository.findByUsername(authentication.getName());
        Merchant merchant = merchantRepository.getMerchantsByUser(user);

        Reservation reservation = reservationRepository.findReservationById(reportDTO.getReservationID());

        if(merchant==null || reservation.getEquipmentListing().getMerchant().getId() != merchant.getId()){
            return null;
        }

        Report report = new Report();
        report.setDescription(reportDTO.getDescription());
        report.setReservation(reservation);

        report = reportRepository.save(report);


        return reportToDTO(report);
    }

    public String banUser(Long clientID){
        if(clientID==null){
            return "ClientID cannot be null";
        }
        //UserEntity user = userRepository.findUserByUserId(userID);
        Optional<Client> clientOpt = clientRepository.findClientByUserId(clientID);
        if(clientOpt.isEmpty()){
            return "No Client with this ID";
        }
        Client client = clientOpt.get();

        client.setCanRent(false);
        clientRepository.save(client);
        return "Client has been banned";
    }


    public List<ReportDTO> getALlReports(){
        List<Report> reports =  reportRepository.findAll();
        List<ReportDTO> lista = new ArrayList<>();
        for(Report report : reports){
            lista.add(reportToDTO(report));
        }
        return lista;
    }


    public ReportDTO reportToDTO(Report report){
        ReportDTO dto = new ReportDTO();
        dto.setDescription(report.getDescription());
        dto.setReservationID(report.getReservation().getId());
        return dto;
    }

}
