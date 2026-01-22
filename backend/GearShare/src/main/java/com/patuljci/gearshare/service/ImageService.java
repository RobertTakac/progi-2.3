package com.patuljci.gearshare.service;

import com.patuljci.gearshare.model.EquipmentListing;
import com.patuljci.gearshare.model.ListingImage;
import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import com.patuljci.gearshare.repository.EquipmentListingRepository;
import com.patuljci.gearshare.repository.ListingImageRepository;
import com.patuljci.gearshare.repository.MerchantRepository;
import com.patuljci.gearshare.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ImageService {

    private final ListingImageRepository listingImageRepository;
    private final UserRepository userRepository;
    private final MerchantRepository merchantRepository;
    private final EquipmentListingRepository equipmentListingRepository;

    public ImageService(ListingImageRepository listingImageRepository, UserRepository userRepository, MerchantRepository merchantRepository, EquipmentListingRepository equipmentListingRepository) {
        this.listingImageRepository = listingImageRepository;
        this.userRepository = userRepository;
        this.merchantRepository = merchantRepository;
        this.equipmentListingRepository = equipmentListingRepository;
    }


    public ListingImage addListingImage(MultipartFile file, Long listingID) throws IOException {

        String clientUser = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(clientUser);
        Merchant merchant = merchantRepository.getMerchantsByUser(user);

        EquipmentListing equipmentListing = equipmentListingRepository.findEquipmentListingBylistingId(listingID);
        if(equipmentListing==null || merchant==null || equipmentListing.getMerchant().getId()!=merchant.getId()){
            System.out.println("ili nema listinga ili nije merchantovo");
            return null;
        }

        ListingImage listingImage = listingImageRepository.findByEquipmentListing(equipmentListing);
        if(listingImage==null){
            listingImage=new ListingImage();
        }
        listingImage.setImage( file.getBytes() );
        listingImage.setEquipmentListing(equipmentListing);



        return listingImageRepository.save(listingImage);
    }

    public byte[] getImage(Long listingID){
        EquipmentListing equipmentListing =  equipmentListingRepository.findEquipmentListingBylistingId(listingID);
        return (listingImageRepository.findByEquipmentListing(equipmentListing)).getImage();
    }

}
