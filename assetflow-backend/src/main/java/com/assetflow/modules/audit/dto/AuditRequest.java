package com.assetflow.modules.audit.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for creating/updating audit cycle.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditRequest {

    @NotBlank(message = "Audit name is required")
    private String auditName;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    private String location;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Assigned auditor ID is required")
    private Long assignedAuditorId;

    private String remarks;
}
