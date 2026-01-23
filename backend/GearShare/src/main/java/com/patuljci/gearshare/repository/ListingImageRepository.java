package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.ListingImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingImageRepository extends JpaRepository<ListingImage, Long> {
    ListingImage findByEquipmentListing(EquipmentListing equipmentListing);
}
