package com.assetflow.modules.audit.repository;

import com.assetflow.modules.audit.entity.AuditItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for AuditItem entity.
 */
@Repository
public interface AuditItemRepository extends JpaRepository<AuditItem, Long> {
    List<AuditItem> findByAuditId(Long auditId);
    Optional<AuditItem> findByAuditIdAndAssetId(Long auditId, Long assetId);
}
