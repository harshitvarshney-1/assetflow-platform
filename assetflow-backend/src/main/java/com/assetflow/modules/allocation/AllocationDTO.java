package com.assetflow.modules.allocation;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AllocationDTO {
    private UUID id;
    private UUID assetId;
    private String assetTag;
    private String assetName;
    private String employee;
    private String department;
    private LocalDate allocatedDate;
    private LocalDate expectedReturnDate;
    private LocalDate actualReturnDate;
    private AllocationStatus status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
