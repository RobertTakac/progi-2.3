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
        try {
            String clientUser = SecurityContextHolder.getContext().getAuthentication().getName();
            System.out.println("Uploading image for user: " + clientUser + ", listingID: " + listingID);

            UserEntity user = userRepository.findByUsername(clientUser);
            if (user == null) {
                System.out.println("User not found: " + clientUser);
                return null;
            }

            Merchant merchant = merchantRepository.getMerchantsByUser(user);
            if (merchant == null) {
                System.out.println("Merchant not found for user: " + clientUser);
                return null;
            }

            EquipmentListing equipmentListing = equipmentListingRepository.findEquipmentListingBylistingId(listingID);
            if (equipmentListing == null) {
                System.out.println("Listing not found: " + listingID);
                return null;
            }

            if (!equipmentListing.getMerchant().getId().equals(merchant.getId())) {
                System.out.println("Listing does not belong to this merchant. Listing merchant ID: "
                        + equipmentListing.getMerchant().getId() + ", current: " + merchant.getId());
                return null;
            }

            ListingImage listingImage = listingImageRepository.findByEquipmentListing(equipmentListing);
            if (listingImage == null) {
                listingImage = new ListingImage();
            }

            System.out.println("Saving image, file size: " + file.getSize() + " bytes");
            listingImage.setImage(file.getBytes());
            listingImage.setEquipmentListing(equipmentListing);

            ListingImage saved = listingImageRepository.save(listingImage);
            System.out.println("Image saved successfully, ID: " + saved.getId());
            return saved;

        } catch (Exception e) {
            System.err.println("Error in addListingImage: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to process image upload", e);  // or return null if you prefer 400
        }
    }

    public byte[] getImage(Long listingID){
        EquipmentListing equipmentListing = equipmentListingRepository.findEquipmentListingBylistingId(listingID);
        if (equipmentListing == null) {
            return null;
        }

        ListingImage listingImage = listingImageRepository.findByEquipmentListing(equipmentListing);
        if (listingImage == null) {
            return null;
        }

        return listingImage.getImage();
    }

}
