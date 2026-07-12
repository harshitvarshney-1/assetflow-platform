package com.assetflow.modules.audit.repository;

import com.assetflow.modules.audit.entity.Audit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Audit entity.
 */
@Repository
public interface AuditRepository extends JpaRepository<Audit, Long> {
    List<Audit> findByDepartmentId(Long departmentId);
    List<Audit> findByStatus(com.assetflow.modules.audit.enums.AuditStatus status);
    List<Audit> findByAssignedAuditorId(Long assignedAuditorId);
}
