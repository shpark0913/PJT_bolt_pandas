package com.ssafy.semes.report.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@ToString
@AllArgsConstructor
public class ReportListResponseDto {
    private String ohtSn;
    private int boltGoodCount;
    private LocalDateTime wheelCheckDate;
    private long wheelChcekId;
    private String wheelPosition;
}