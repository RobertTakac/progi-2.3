package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class NewReservationDTO {
    private Long listingID;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer quantity = 1;
}
