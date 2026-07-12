package com.assetflow.modules.asset;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface AssetService {
    AssetDTO createAsset(AssetCreateDTO assetCreateDTO);
    AssetDTO updateAsset(UUID id, AssetUpdateDTO assetUpdateDTO);
    AssetDTO getAssetById(UUID id);
    void deleteAsset(UUID id);
    Page<AssetDTO> getAllAssets(String name, String tag, String serialNumber, String category, String department, String status, String location, Pageable pageable);
    Page<AssetDTO> searchAssets(String query, Pageable pageable);
    Page<AssetDTO> filterAssets(String category, String department, String status, LocalDate purchaseDateStart, LocalDate purchaseDateEnd, LocalDate warrantyExpiryStart, LocalDate warrantyExpiryEnd, AssetCondition condition, Pageable pageable);
    List<AssetHistory> getAssetHistory(UUID assetId);
    void logHistory(UUID assetId, String action, String description);
}
