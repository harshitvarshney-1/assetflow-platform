package com.assetflow.modules.transfer;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TransferDTO {
    private UUID id;
    private UUID assetId;
    private String assetTag;
    private String assetName;
    private String fromEmployee;
    private String toEmployee;
    private String requestedBy;
    private String approvedBy;
    private String reason;
    private TransferStatus status;
    private LocalDateTime createdDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
