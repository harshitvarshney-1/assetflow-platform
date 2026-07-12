package com.assetflow.modules.asset;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AssetHistoryRepository extends JpaRepository<AssetHistory, UUID> {
    List<AssetHistory> findByAssetIdOrderByActionDateDesc(UUID assetId);
}
