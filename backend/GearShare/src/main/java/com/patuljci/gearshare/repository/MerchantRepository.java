package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.Merchant;
import com.patuljci.gearshare.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {

    Optional<Merchant> findMerchantByUserId(Long userId);

    Merchant getMerchantsByUser(UserEntity user);
}
