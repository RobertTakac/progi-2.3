package com.patuljci.gearshare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "equipment_category")
@Getter
@Setter
public class EquipmentCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    
}
