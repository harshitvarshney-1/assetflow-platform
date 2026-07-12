package com.assetflow.modules.maintenance.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating or updating a maintenance request.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceRequest {

    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotBlank(message = "Issue title is required")
    private String issueTitle;

    private String issueDescription;

    @NotBlank(message = "Priority is required")
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    @NotNull(message = "Raised by (employee ID) is required")
    private Long raisedById;

    private Long technicianId;

    private Double estimatedCost;

    private Double actualCost;

    private String maintenanceType;

    private String remarks;
}
