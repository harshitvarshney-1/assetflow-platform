package com.assetflow.modules.audit.service;

import com.assetflow.dto.ApiResponse;
import com.assetflow.modules.audit.dto.*;
import com.assetflow.modules.audit.entity.Audit;
import com.assetflow.modules.audit.entity.AuditHistory;
import com.assetflow.modules.audit.entity.AuditItem;
import com.assetflow.modules.audit.enums.AuditStatus;
import com.assetflow.modules.audit.enums.VerificationStatus;
import com.assetflow.modules.audit.repository.AuditHistoryRepository;
import com.assetflow.modules.audit.repository.AuditItemRepository;
import com.assetflow.modules.audit.repository.AuditRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Audit Management operations.
 */
@Service
@RequiredArgsConstructor
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);

    private final AuditRepository auditRepository;
    private final AuditItemRepository auditItemRepository;
    private final AuditHistoryRepository auditHistoryRepository;

    /**
     * Schedules a new audit cycle.
     */
    @Transactional
    public ApiResponse<AuditResponse> scheduleAudit(AuditRequest request) {
        log.info("Scheduling audit cycle '{}' for department ID: {}", request.getAuditName(), request.getDepartmentId());

        Audit audit = Audit.builder()
                .auditName(request.getAuditName())
                .departmentId(request.getDepartmentId())
                .location(request.getLocation())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .assignedAuditorId(request.getAssignedAuditorId())
                .status(AuditStatus.SCHEDULED)
                .remarks(request.getRemarks())
                .build();

        Audit saved = auditRepository.save(audit);
        logHistory(saved, "SCHEDULED", request.getAssignedAuditorId(), "Audit scheduled");
        log.info("Audit cycle scheduled with ID: {}", saved.getId());

        return ApiResponse.success("Audit scheduled successfully.", toResponse(saved));
    }

    /**
     * Retrieves all audits.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<AuditResponse>> getAllAudits() {
        log.info("Fetching all audits");
        List<AuditResponse> audits = auditRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Audits retrieved successfully.", audits);
    }

    /**
     * Retrieves a single audit by ID.
     */
    @Transactional(readOnly = true)
    public ApiResponse<AuditResponse> getAuditById(Long id) {
        log.info("Fetching audit with ID: {}", id);
        Audit audit = auditRepository.findById(id).orElse(null);
        if (audit == null) {
            log.warn("Audit cycle not found with ID: {}", id);
            return ApiResponse.error("Audit cycle not found with ID: " + id);
        }
        return ApiResponse.success("Audit retrieved successfully.", toResponse(audit));
    }

    /**
     * Starts an audit cycle.
     */
    @Transactional
    public ApiResponse<AuditResponse> startAudit(Long id, Long performedBy) {
        log.info("Starting audit ID: {}", id);
        Audit audit = auditRepository.findById(id).orElse(null);
        if (audit == null) {
            return ApiResponse.error("Audit cycle not found with ID: " + id);
        }
        if (audit.getStatus() != AuditStatus.SCHEDULED) {
            return ApiResponse.error("Only SCHEDULED audits can be started. Current status: " + audit.getStatus());
        }

        audit.setStatus(AuditStatus.IN_PROGRESS);
        Audit saved = auditRepository.save(audit);
        logHistory(saved, "STARTED", performedBy, "Audit started");
        return ApiResponse.success("Audit status updated to IN_PROGRESS.", toResponse(saved));
    }

    /**
     * Audits / verifies a single asset in an audit cycle.
     */
    @Transactional
    public ApiResponse<AuditItemResponse> verifyAsset(Long auditId, AuditItemRequest request, Long performedBy) {
        log.info("Verifying asset ID: {} in audit ID: {}", request.getAssetId(), auditId);
        Audit audit = auditRepository.findById(auditId).orElse(null);
        if (audit == null) {
            return ApiResponse.error("Audit cycle not found with ID: " + auditId);
        }
        if (audit.getStatus() != AuditStatus.IN_PROGRESS) {
            return ApiResponse.error("Assets can only be audited during an IN_PROGRESS cycle.");
        }

        // Check if status is valid
        try {
            VerificationStatus.valueOf(request.getVerificationStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("Invalid verification status: " + request.getVerificationStatus());
        }

        // Check if item is already audited in this cycle
        AuditItem item = auditItemRepository.findByAuditIdAndAssetId(auditId, request.getAssetId())
                .orElse(null);

        if (item == null) {
            item = AuditItem.builder()
                    .audit(audit)
                    .assetId(request.getAssetId())
                    .verificationStatus(request.getVerificationStatus().toUpperCase())
                    .remarks(request.getRemarks())
                    .build();
        } else {
            item.setVerificationStatus(request.getVerificationStatus().toUpperCase());
            item.setRemarks(request.getRemarks());
        }

        AuditItem saved = auditItemRepository.save(item);
        logHistory(audit, "ASSET_VERIFIED", performedBy, "Asset ID " + request.getAssetId() + " status set to " + request.getVerificationStatus());
        
        return ApiResponse.success("Asset verified successfully in this cycle.", toItemResponse(saved));
    }

    /**
     * Retrieves all verified items of an audit cycle.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<AuditItemResponse>> getAuditItems(Long auditId) {
        log.info("Fetching verified items for audit ID: {}", auditId);
        List<AuditItemResponse> items = auditItemRepository.findByAuditId(auditId)
                .stream()
                .map(this::toItemResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Audit items retrieved successfully.", items);
    }

    /**
     * Completes an audit cycle.
     */
    @Transactional
    public ApiResponse<AuditResponse> completeAudit(Long id, Long performedBy) {
        log.info("Completing audit cycle ID: {}", id);
        Audit audit = auditRepository.findById(id).orElse(null);
        if (audit == null) {
            return ApiResponse.error("Audit cycle not found with ID: " + id);
        }
        if (audit.getStatus() != AuditStatus.IN_PROGRESS) {
            return ApiResponse.error("Only IN_PROGRESS audits can be completed.");
        }

        audit.setStatus(AuditStatus.COMPLETED);
        Audit saved = auditRepository.save(audit);
        logHistory(saved, "COMPLETED", performedBy, "Audit cycle completed");
        return ApiResponse.success("Audit status updated to COMPLETED.", toResponse(saved));
    }

    /**
     * Closes an audit cycle.
     */
    @Transactional
    public ApiResponse<AuditResponse> closeAudit(Long id, Long performedBy) {
        log.info("Closing audit cycle ID: {}", id);
        Audit audit = auditRepository.findById(id).orElse(null);
        if (audit == null) {
            return ApiResponse.error("Audit cycle not found with ID: " + id);
        }
        if (audit.getStatus() != AuditStatus.COMPLETED) {
            return ApiResponse.error("Only COMPLETED audits can be closed.");
        }

        audit.setStatus(AuditStatus.CLOSED);
        Audit saved = auditRepository.save(audit);
        logHistory(saved, "CLOSED", performedBy, "Audit cycle closed");
        return ApiResponse.success("Audit status updated to CLOSED.", toResponse(saved));
    }

    /**
     * Retrieves audit history.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<AuditHistory>> getAuditHistory(Long auditId) {
        log.info("Fetching history for audit ID: {}", auditId);
        List<AuditHistory> history = auditHistoryRepository.findByAuditIdOrderByCreatedAtDesc(auditId);
        return ApiResponse.success("Audit history retrieved successfully.", history);
    }

    private void logHistory(Audit audit, String action, Long performedBy, String remarks) {
        AuditHistory history = AuditHistory.builder()
                .audit(audit)
                .action(action)
                .performedBy(performedBy)
                .remarks(remarks)
                .build();
        auditHistoryRepository.save(history);
    }

    private AuditResponse toResponse(Audit audit) {
        return AuditResponse.builder()
                .id(audit.getId())
                .auditName(audit.getAuditName())
                .departmentId(audit.getDepartmentId())
                .location(audit.getLocation())
                .startDate(audit.getStartDate())
                .endDate(audit.getEndDate())
                .assignedAuditorId(audit.getAssignedAuditorId())
                .status(audit.getStatus().name())
                .remarks(audit.getRemarks())
                .createdAt(audit.getCreatedAt())
                .updatedAt(audit.getUpdatedAt())
                .build();
    }

    private AuditItemResponse toItemResponse(AuditItem item) {
        return AuditItemResponse.builder()
                .id(item.getId())
                .auditId(item.getAudit().getId())
                .assetId(item.getAssetId())
                .verificationStatus(item.getVerificationStatus())
                .remarks(item.getRemarks())
                .createdAt(item.getCreatedAt())
                .build();
    }
}
