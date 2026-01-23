package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class ReservationDTO {
        private Long reservationID;

        private String merchantUsername;
        private String clientUsername;

        private ListingDto listing;

        private Long listingID;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
        private Integer quantity = 1;

        private String status;

}
