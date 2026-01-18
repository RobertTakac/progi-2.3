package com.patuljci.gearshare.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.security.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name="clients")
@Setter
@Getter
public class Client{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long client_id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", referencedColumnName="id", nullable = false)
    private UserEntity user;

    @Column
    private Boolean canRent=true;

    @Column
    private LocalDateTime createdAt;


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}