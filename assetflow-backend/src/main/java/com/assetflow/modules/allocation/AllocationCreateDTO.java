package com.assetflow.modules.allocation;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class AllocationCreateDTO {

    @NotNull(message = "Asset ID is required")
    private UUID assetId;

    @NotBlank(message = "Employee name is required")
    private String employee;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Allocation date is required")
    private LocalDate allocatedDate;

    @NotNull(message = "Expected return date is required")
    private LocalDate expectedReturnDate;

    private String notes;
}
