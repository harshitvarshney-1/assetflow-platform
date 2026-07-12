package com.assetflow.modules.audit.repository;

import com.assetflow.modules.audit.entity.AuditHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for AuditHistory entity.
 */
@Repository
public interface AuditHistoryRepository extends JpaRepository<AuditHistory, Long> {
    List<AuditHistory> findByAuditIdOrderByCreatedAtDesc(Long auditId);
}
