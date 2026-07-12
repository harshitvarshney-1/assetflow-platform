package com.assetflow.modules.asset;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class AssetUpdateDTO {

    @NotBlank(message = "Asset name is required")
    @Size(max = 255)
    private String assetName;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;

    @NotNull(message = "Purchase cost is required")
    @DecimalMin(value = "0.0", message = "Purchase cost must be greater than or equal to 0")
    private BigDecimal purchaseCost;

    private String manufacturer;
    private String modelNumber;
    private LocalDate warrantyExpiry;

    @NotNull(message = "Condition is required")
    private AssetCondition condition;

    private String location;
    private String image;
    private String documents;
    private String description;

    @NotNull(message = "Status is required")
    private AssetStatus status;
}
