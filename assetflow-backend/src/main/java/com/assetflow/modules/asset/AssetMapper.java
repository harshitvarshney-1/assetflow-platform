package com.assetflow.modules.asset;

import org.springframework.stereotype.Component;

@Component
public class AssetMapper {

    public AssetDTO toDTO(Asset asset) {
        if (asset == null) {
            return null;
        }
        AssetDTO dto = new AssetDTO();
        dto.setId(asset.getId());
        dto.setAssetTag(asset.getAssetTag());
        dto.setAssetName(asset.getAssetName());
        dto.setCategory(asset.getCategory());
        dto.setDepartment(asset.getDepartment());
        dto.setCurrentHolder(asset.getCurrentHolder());
        dto.setSerialNumber(asset.getSerialNumber());
        dto.setPurchaseDate(asset.getPurchaseDate());
        dto.setPurchaseCost(asset.getPurchaseCost());
        dto.setManufacturer(asset.getManufacturer());
        dto.setModelNumber(asset.getModelNumber());
        dto.setWarrantyExpiry(asset.getWarrantyExpiry());
        dto.setCondition(asset.getCondition());
        dto.setLocation(asset.getLocation());
        dto.setImage(asset.getImage());
        dto.setDocuments(asset.getDocuments());
        dto.setDescription(asset.getDescription());
        dto.setStatus(asset.getStatus());
        dto.setCreatedAt(asset.getCreatedAt());
        dto.setUpdatedAt(asset.getUpdatedAt());
        return dto;
    }

    public Asset toEntity(AssetCreateDTO dto) {
        if (dto == null) {
            return null;
        }
        Asset asset = new Asset();
        updateEntity(asset, dto);
        return asset;
    }

    public void updateEntity(Asset asset, AssetCreateDTO dto) {
        asset.setAssetName(dto.getAssetName());
        asset.setCategory(dto.getCategory());
        asset.setDepartment(dto.getDepartment());
        asset.setSerialNumber(dto.getSerialNumber());
        asset.setPurchaseDate(dto.getPurchaseDate());
        asset.setPurchaseCost(dto.getPurchaseCost());
        asset.setManufacturer(dto.getManufacturer());
        asset.setModelNumber(dto.getModelNumber());
        asset.setWarrantyExpiry(dto.getWarrantyExpiry());
        asset.setCondition(dto.getCondition());
        asset.setLocation(dto.getLocation());
        asset.setImage(dto.getImage());
        asset.setDocuments(dto.getDocuments());
        asset.setDescription(dto.getDescription());
        asset.setStatus(dto.getStatus());
    }

    public void updateEntity(Asset asset, AssetUpdateDTO dto) {
        asset.setAssetName(dto.getAssetName());
        asset.setCategory(dto.getCategory());
        asset.setDepartment(dto.getDepartment());
        asset.setSerialNumber(dto.getSerialNumber());
        asset.setPurchaseDate(dto.getPurchaseDate());
        asset.setPurchaseCost(dto.getPurchaseCost());
        asset.setManufacturer(dto.getManufacturer());
        asset.setModelNumber(dto.getModelNumber());
        asset.setWarrantyExpiry(dto.getWarrantyExpiry());
        asset.setCondition(dto.getCondition());
        asset.setLocation(dto.getLocation());
        asset.setImage(dto.getImage());
        asset.setDocuments(dto.getDocuments());
        asset.setDescription(dto.getDescription());
        asset.setStatus(dto.getStatus());
    }
}
