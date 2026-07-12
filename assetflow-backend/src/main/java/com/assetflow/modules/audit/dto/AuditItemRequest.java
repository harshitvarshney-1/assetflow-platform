package com.assetflow.modules.audit.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for recording verification status of an asset during audit.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditItemRequest {

    @NotNull(message = "Asset ID is required")
    private Long assetId;

    @NotBlank(message = "Verification status is required")
    private String verificationStatus; // VERIFIED, MISSING, DAMAGED, LOST

    private String remarks;
}
