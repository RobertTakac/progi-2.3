package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.EquipmentCategory;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.Merchant;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EquipmentListingRepository extends JpaRepository<EquipmentListing, Long>, JpaSpecificationExecutor<EquipmentListing> {

    List<EquipmentListing> findAll(Specification<EquipmentListing> spec);

    Optional<List<EquipmentListing>> findEquipmentListingByMerchant(Merchant merchant);

    Optional<List<EquipmentListing>> findEquipmentListingByCategory(EquipmentCategory equipmentCategory);

    EquipmentListing findEquipmentListingBylistingId(Long id);


}
