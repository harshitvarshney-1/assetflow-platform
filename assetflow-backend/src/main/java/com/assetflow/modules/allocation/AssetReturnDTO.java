package com.assetflow.modules.allocation;

import com.assetflow.modules.asset.AssetCondition;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssetReturnDTO {

    @NotNull(message = "Return date is required")
    private LocalDateTime returnDate;

    @NotBlank(message = "Returned by is required")
    private String returnedBy;

    @NotNull(message = "Asset condition is required")
    private AssetCondition condition;

    private String remarks;
}
