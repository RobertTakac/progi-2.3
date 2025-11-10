package com.patuljci.gearshare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "equipment_listings")
@Getter
@Setter
public class EquipmentListing {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;



}
