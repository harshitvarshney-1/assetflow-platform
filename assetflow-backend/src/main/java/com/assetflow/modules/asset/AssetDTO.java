package com.assetflow.modules.asset;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AssetDTO {
    private UUID id;
    private String assetTag;
    private String assetName;
    private String category;
    private String department;
    private String currentHolder;
    private String serialNumber;
    private LocalDate purchaseDate;
    private BigDecimal purchaseCost;
    private String manufacturer;
    private String modelNumber;
    private LocalDate warrantyExpiry;
    private AssetCondition condition;
    private String location;
    private String image;
    private String documents;
    private String description;
    private AssetStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
