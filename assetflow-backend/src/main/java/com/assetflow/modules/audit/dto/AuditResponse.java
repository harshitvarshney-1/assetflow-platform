package com.assetflow.modules.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO for Audit response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditResponse {
    private Long id;
    private String auditName;
    private Long departmentId;
    private String location;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long assignedAuditorId;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
