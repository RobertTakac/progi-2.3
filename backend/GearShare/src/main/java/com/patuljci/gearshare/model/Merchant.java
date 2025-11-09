package com.patuljci.gearshare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDateTime;

@Entity
@Table(name = "merchant")
@Getter
@Setter
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    @JoinColumn(name="users")
    private long user_id;

    @Column(nullable = false, name="business_name")
    private String businessName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String postalCode;

    @ColumnDefault("Croatia")
    @Column(nullable = false)
    private String country;

    @Column(nullable = true)
    private String description;

    @ColumnDefault("0.00")
    private BigDecimal average_rating;

    @ColumnDefault("0")
    @Column(name="total_reviews")
    private int totalReviews;

    @ColumnDefault("false")
    @Column(name="membership_active")
    private boolean membershipActive;

    @Column(name="membership_expires_at")
    private LocalDateTime membershipExpiresAt;

    //@ColumnDefault() treba dodati da je default current timestamp(nekako)
    @Column(name="created_at")
    private LocalDateTime  createdAt;
}
