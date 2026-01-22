package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.Review;
import com.patuljci.gearshare.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findReviewsByMerchant(Merchant merchant);

}
