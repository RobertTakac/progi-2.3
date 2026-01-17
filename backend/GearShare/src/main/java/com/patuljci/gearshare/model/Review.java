package com.patuljci.gearshare.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name="reviews")
@Setter
@Getter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "reservation_id",unique = false, referencedColumnName="id", nullable = false)
    private Reservation reservation;

    @Column(nullable = false)
    @Max(5)
    @Min(1)
    private Integer rating;

    @Column(nullable = true)
    private String comment;

}
