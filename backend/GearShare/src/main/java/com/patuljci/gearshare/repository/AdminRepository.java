package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin,Integer> {

    Optional<Admin> findAdminByUserId(Long id);
}
