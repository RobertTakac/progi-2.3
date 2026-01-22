package com.patuljci.gearshare.service;

import com.patuljci.gearshare.dto.NewReviewDTO;
import com.patuljci.gearshare.dto.ReviewDTO;
import com.patuljci.gearshare.model.*;
import com.patuljci.gearshare.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final ClientService clientService;
    private final MerchantRepository merchantRepository;
    private final MerchantService merchantService;

    public ReviewService(ReviewRepository reviewRepository, ReservationRepository reservationRepository, UserRepository userRepository, ClientRepository clientRepository, ClientService clientService, MerchantRepository merchantRepository, MerchantService merchantService) {
        this.reviewRepository = reviewRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.clientService = clientService;
        this.merchantRepository = merchantRepository;
        this.merchantService = merchantService;
    }

    public ReviewDTO addReview(NewReviewDTO newReviewDTO){

        String clientUser = SecurityContextHolder.getContext().getAuthentication().getName();
        UserEntity user = userRepository.findByUsername(clientUser);
        Client client = clientRepository.findClientByUserId(user.getId()).orElse(null);



        Review review = new Review();

        Reservation reservation = reservationRepository.findReservationById(newReviewDTO.getReservationID());
        if(reservation == null){
            return null;
        }
        if(client == null || client.getClient_id() != reservation.getClient().getClient_id() ){
            return null;
        }


        review.setReservation(reservation);
        review.setRating(newReviewDTO.getRating());
        review.setComment(newReviewDTO.getComment());

        reviewRepository.save(review);

        Merchant merchant = reservation.getEquipmentListing().getMerchant();
        merchant.setTotalReviews(merchant.getTotalReviews() + 1);

        BigDecimal d= merchant.getAverageRating();
        if(d==null){
         d= BigDecimal.valueOf(0.0);
        }
        d=d.multiply (BigDecimal.valueOf(merchant.getTotalReviews() - 1)).add( BigDecimal.valueOf(review.getRating()) );
        d = d.divide(BigDecimal.valueOf(merchant.getTotalReviews()));
        merchant.setAverageRating(d);

        merchantRepository.save(merchant);

        return reviewToReviewDTO(review);
    }

    public List<ReviewDTO> getReviews(Long merchantID){
        Merchant merchant = merchantRepository.findMerchantByid(merchantID);

        List<Review> reviews = reviewRepository.findReviewsByMerchant(merchant);

        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for(Review review : reviews){
            reviewDTOS.add(reviewToReviewDTO(review));
        }
        return  reviewDTOS;
    }


    public ReviewDTO reviewToReviewDTO(Review review){
        ReviewDTO dto = new ReviewDTO();

        dto.setId(review.getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());

        dto.setReservation(clientService.reservationToDTO(review.getReservation()));



        return dto;
    }

}
