package com.patuljci.gearshare.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReportDTO {
    private Long id;
    private Long reservationID;
    private String description;
}
