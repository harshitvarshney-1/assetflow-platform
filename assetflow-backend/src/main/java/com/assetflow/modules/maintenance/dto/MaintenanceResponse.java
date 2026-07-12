package com.assetflow.modules.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO returned by Maintenance APIs.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceResponse {
    private Long id;
    private Long assetId;
    private String issueTitle;
    private String issueDescription;
    private String priority;
    private Long raisedById;
    private Long technicianId;
    private Double estimatedCost;
    private Double actualCost;
    private String maintenanceType;
    private LocalDate createdDate;
    private LocalDate completedDate;
    private String remarks;
    private String status;
}
