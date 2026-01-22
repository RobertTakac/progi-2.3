package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.Report;
import com.patuljci.gearshare.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {

    List<Report> findReportByReservation(Reservation reservation);

    void deleteByReservation(Reservation reservation);
}
