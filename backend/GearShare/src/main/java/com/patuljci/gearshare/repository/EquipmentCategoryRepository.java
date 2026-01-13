package com.patuljci.gearshare.repository;

import com.patuljci.gearshare.model.EquipmentCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipmentCategoryRepository extends JpaRepository<EquipmentCategory, Long> {

    Optional<EquipmentCategory> findEquipmentCategoryByName(String name);

    Optional<EquipmentCategory> findEquipmentCategoryById(Long id);
}
