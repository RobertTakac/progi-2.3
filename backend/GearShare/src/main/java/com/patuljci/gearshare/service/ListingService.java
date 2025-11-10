package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.ListingDto;
import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.repository.EquipmentListingRepository;
import org.springframework.stereotype.Service;

@Service
public class ListingService {

    private final EquipmentListingRepository equipmentListingRepository;

    ListingService(EquipmentListingRepository equipmentListingRepository) {
        this.equipmentListingRepository = equipmentListingRepository;
    }

    public EquipmentListing createListing(ListingDto listingDto) {

        EquipmentListing equipmentListing = new EquipmentListing();


        return  equipmentListingRepository.save(equipmentListing);
    }

}
