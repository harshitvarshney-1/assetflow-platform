package com.assetflow.modules.transfer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class TransferRequestDTO {

    @NotNull(message = "Asset ID is required")
    private UUID assetId;

    @NotBlank(message = "Destination employee is required")
    private String toEmployee;

    @NotBlank(message = "Reason for transfer is required")
    private String reason;
}
