package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.EquipmentCategory;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentListingRepository extends JpaRepository<EquipmentListing, Long> {

    Optional<List<EquipmentListing>> findEquipmentListingByMerchant(Merchant merchant);

    Optional<List<EquipmentListing>> findEquipmentListingByCategory(EquipmentCategory equipmentCategory);

}
