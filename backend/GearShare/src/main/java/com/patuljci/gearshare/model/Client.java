package com.patuljci.gearshare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.security.Timestamp;

@Entity
@Table(name="clients")
@Setter
@Getter
public class Client{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long client_id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName="id", nullable = false)
    private User user;

    @Column
    private String location;

    @Column
    private Boolean canRent=true;

    @Column
    private Timestamp createdAt;//default bi trebao biti current timestamp
}
