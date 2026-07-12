package com.assetflow.modules.transfer;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransferUpdateDTO {

    @NotNull(message = "Transfer status is required")
    private TransferStatus status;

    private String approvedBy;
}
