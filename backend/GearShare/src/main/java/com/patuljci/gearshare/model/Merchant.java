package com.patuljci.gearshare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "merchant")
@Getter
@Setter
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, name = "business_name")
    private String businessName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String postalCode;

    @Column(nullable = false)
    @ColumnDefault("'Croatia'")
    private String country = "Croatia";

    private String description;

    @ColumnDefault("0.00")
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    @ColumnDefault("0")
    private int totalReviews = 0;

    @Column(name = "membership_active")
    @ColumnDefault("false")
    private boolean membershipActive = false;

    @Column(name = "membership_expires_at")
    private LocalDateTime membershipExpiresAt;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}