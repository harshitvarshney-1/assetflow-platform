package com.assetflow.modules.maintenance.repository;

import com.assetflow.modules.maintenance.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Maintenance entity.
 */
@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    List<Maintenance> findByStatusOrderByCreatedDateDesc(String status);

    List<Maintenance> findByAssetIdOrderByCreatedDateDesc(Long assetId);

    List<Maintenance> findByRaisedByIdOrderByCreatedDateDesc(Long raisedById);

    List<Maintenance> findByTechnicianIdOrderByCreatedDateDesc(Long technicianId);

    List<Maintenance> findByPriorityOrderByCreatedDateDesc(String priority);
}
