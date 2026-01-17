package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReviewDTO {

    private Long id;
    private ReservationDTO reservation;
    private Integer rating;
    private String comment;

}
