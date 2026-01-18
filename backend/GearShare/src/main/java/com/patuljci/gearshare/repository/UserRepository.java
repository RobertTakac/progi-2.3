package com.patuljci.gearshare.repository;


import com.patuljci.gearshare.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByVerificationCode(String verificationCode);

    UserEntity findByUsername(String username);

    UserEntity findUserByUserId(Long userId);

}
