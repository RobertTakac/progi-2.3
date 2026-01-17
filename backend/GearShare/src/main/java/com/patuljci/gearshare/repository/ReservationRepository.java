package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.Client;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findReservationByClient(Client client);

    List<Reservation> findReservationByEquipmentListing(EquipmentListing equipmentListing);

}
