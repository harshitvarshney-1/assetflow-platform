package com.assetflow.modules.maintenance.repository;

import com.assetflow.modules.maintenance.entity.MaintenanceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for MaintenanceHistory entity.
 */
@Repository
public interface MaintenanceHistoryRepository extends JpaRepository<MaintenanceHistory, Long> {
    List<MaintenanceHistory> findByMaintenanceIdOrderByCreatedAtDesc(Long maintenanceId);
}
