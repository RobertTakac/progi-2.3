package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class NewReviewDTO {
    private Long reservationID;
    private Integer rating;
    private String comment;
}
