package com.assetflow.modules.allocation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReturnLogRepository extends JpaRepository<ReturnLog, UUID> {
    List<ReturnLog> findByAssetIdOrderByReturnDateDesc(UUID assetId);
}
