package com.assetflow.modules.asset;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AssetRepository extends JpaRepository<Asset, UUID>, JpaSpecificationExecutor<Asset> {
    Optional<Asset> findBySerialNumber(String serialNumber);
    Optional<Asset> findByAssetTag(String assetTag);
    boolean existsBySerialNumber(String serialNumber);
    boolean existsBySerialNumberAndIdNot(String serialNumber, UUID id);
}
