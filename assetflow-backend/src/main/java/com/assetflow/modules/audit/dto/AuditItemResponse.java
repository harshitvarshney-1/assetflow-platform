package com.assetflow.modules.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for AuditItem response.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditItemResponse {
    private Long id;
    private Long auditId;
    private Long assetId;
    private String verificationStatus;
    private String remarks;
    private LocalDateTime createdAt;
}
