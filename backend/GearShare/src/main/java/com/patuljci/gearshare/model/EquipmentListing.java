package com.patuljci.gearshare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@EntityListeners(EquipmentListingGeocodingListener.class)
@Entity
@Table(name = "equipment_listings")
@Getter
@Setter
public class EquipmentListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long listingId;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "merchant_id", nullable = false)
    private Merchant merchant;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "category_id", nullable = false)
    private EquipmentCategory category;

    @Column(length = 250)
    private String title;

    @Column(length = 1000, nullable = false)
    private String description;

    @Column(name = "image_path", length = 250, nullable = false)
    private String imagePath;

    @Column(name = "daily_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal dailyPrice;

    @Column(name = "deposit_amount", precision = 10, scale = 2)
    private BigDecimal depositAmount = BigDecimal.valueOf(0.00);

    @Column(length = 3)
    private String currency = "EUR";

    @Column(name = "available_from", nullable = false)
    private LocalDateTime availableFrom;

    @Column(name = "available_until", nullable = false)
    private LocalDateTime availableUntil;

    @Column(name="pickup_address", length=500, nullable=false)
    private String pickupAddress;

    @Column(name="pickup_area", length=250)
    private String pickupArea;

    @Column(name="pickup_city", length=250, nullable=false)
    private String pickupCity;

    @Column(name="pickup_postal_code", length=20, nullable=false)
    private String pickupPostalCode;

    @Column(name="pickup_country", length=100, nullable=false)
    private String pickupCountry = "Croatia";

    @Column(nullable = true)
    private Double pickupLatitude;

    @Column(nullable = true)
    private Double pickupLongitude;

    @Column(name="return_address", length=500, nullable=false)
    private String returnAddress;

    @Column(name="return_area", length=250)
    private String returnArea;

    @Column(name="return_city", length=250, nullable=false)
    private String returnCity;

    @Column(name="return_postal_code", length=20, nullable=false)
    private String returnPostalCode;

    @Column(name="return_country", length=100, nullable=false)
    private String returnCountry = "Croatia";

    @Column(nullable = true)
    private Double returnLatitude;

    @Column(nullable = true)
    private Double returnLongitude;

    @Column(name = "quantity_available")
    private Integer quantityAvailable = 1;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating = BigDecimal.valueOf(0.00);

    @Column(name = "total_reviews")
    private Integer totalReviews = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() { this.updatedAt = LocalDateTime.now(); }
}