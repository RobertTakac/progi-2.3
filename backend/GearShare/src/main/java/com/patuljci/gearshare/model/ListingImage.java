package com.patuljci.gearshare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "listing_image")
@Getter
@Setter
public class ListingImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "listing_id", nullable = false)
    private EquipmentListing equipmentListing;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "image", nullable = false)
    private byte[] image;
}
