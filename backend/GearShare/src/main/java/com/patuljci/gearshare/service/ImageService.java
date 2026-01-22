package com.patuljci.gearshare.service;

import com.patuljci.gearshare.repository.ListingImageRepository;
import org.springframework.stereotype.Service;

@Service
public class ImageService {

    private final ListingImageRepository listingImageRepository;

    public ImageService(ListingImageRepository listingImageRepository) {
        this.listingImageRepository = listingImageRepository;
    }



}
