package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.Review;
import com.patuljci.gearshare.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {



}
