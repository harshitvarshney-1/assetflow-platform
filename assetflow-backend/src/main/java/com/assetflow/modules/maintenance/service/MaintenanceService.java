package com.assetflow.modules.maintenance.service;

import com.assetflow.dto.ApiResponse;
import com.assetflow.modules.maintenance.dto.MaintenanceRequest;
import com.assetflow.modules.maintenance.dto.MaintenanceResponse;
import com.assetflow.modules.maintenance.entity.Maintenance;
import com.assetflow.modules.maintenance.entity.MaintenanceHistory;
import com.assetflow.modules.maintenance.enums.MaintenancePriority;
import com.assetflow.modules.maintenance.enums.MaintenanceStatus;
import com.assetflow.modules.maintenance.repository.MaintenanceHistoryRepository;
import com.assetflow.modules.maintenance.repository.MaintenanceRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Maintenance Management operations.
 * Handles CRUD, status transitions, technician assignment, and history logging.
 */
@Service
@RequiredArgsConstructor
public class MaintenanceService {

    private static final Logger log = LoggerFactory.getLogger(MaintenanceService.class);

    private final MaintenanceRepository maintenanceRepository;
    private final MaintenanceHistoryRepository maintenanceHistoryRepository;

    /**
     * Creates a new maintenance request.
     */
    @Transactional
    public ApiResponse<MaintenanceResponse> createMaintenance(MaintenanceRequest request) {
        log.info("Creating maintenance request for asset ID: {} by employee ID: {}", request.getAssetId(), request.getRaisedById());

        Maintenance maintenance = Maintenance.builder()
                .assetId(request.getAssetId())
                .issueTitle(request.getIssueTitle())
                .issueDescription(request.getIssueDescription())
                .priority(request.getPriority().toUpperCase())
                .raisedById(request.getRaisedById())
                .technicianId(request.getTechnicianId())
                .estimatedCost(request.getEstimatedCost())
                .actualCost(request.getActualCost())
                .maintenanceType(request.getMaintenanceType())
                .createdDate(LocalDate.now())
                .remarks(request.getRemarks())
                .status(MaintenanceStatus.PENDING.name())
                .build();

        Maintenance saved = maintenanceRepository.save(maintenance);
        logHistory(saved, "CREATED", request.getRaisedById(), "Maintenance request created");
        log.info("Maintenance request created with ID: {}", saved.getId());

        return ApiResponse.success("Maintenance request created successfully.", toResponse(saved));
    }

    /**
     * Retrieves all maintenance requests.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<MaintenanceResponse>> getAllMaintenance() {
        log.info("Fetching all maintenance requests");
        List<MaintenanceResponse> list = maintenanceRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        log.info("Retrieved {} maintenance requests", list.size());
        return ApiResponse.success("Maintenance requests retrieved successfully.", list);
    }

    /**
     * Retrieves a single maintenance request by ID.
     */
    @Transactional(readOnly = true)
    public ApiResponse<MaintenanceResponse> getMaintenanceById(Long id) {
        log.info("Fetching maintenance request with ID: {}", id);
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);

        if (maintenance == null) {
            log.warn("Maintenance request not found with ID: {}", id);
            return ApiResponse.error("Maintenance request not found with ID: " + id);
        }

        return ApiResponse.success("Maintenance request retrieved successfully.", toResponse(maintenance));
    }

    /**
     * Updates an existing maintenance request.
     */
    @Transactional
    public ApiResponse<MaintenanceResponse> updateMaintenance(Long id, MaintenanceRequest request) {
        log.info("Updating maintenance request with ID: {}", id);
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);

        if (maintenance == null) {
            log.warn("Maintenance request not found with ID: {}", id);
            return ApiResponse.error("Maintenance request not found with ID: " + id);
        }

        if (MaintenanceStatus.CLOSED.name().equals(maintenance.getStatus())) {
            log.warn("Cannot update maintenance ID: {} - already CLOSED", id);
            return ApiResponse.error("Cannot update a closed maintenance request.");
        }

        maintenance.setAssetId(request.getAssetId());
        maintenance.setIssueTitle(request.getIssueTitle());
        maintenance.setIssueDescription(request.getIssueDescription());
        maintenance.setPriority(request.getPriority().toUpperCase());
        maintenance.setEstimatedCost(request.getEstimatedCost());
        maintenance.setActualCost(request.getActualCost());
        maintenance.setMaintenanceType(request.getMaintenanceType());
        maintenance.setRemarks(request.getRemarks());

        Maintenance saved = maintenanceRepository.save(maintenance);
        logHistory(saved, "UPDATED", request.getRaisedById(), "Maintenance request updated");
        log.info("Maintenance request updated with ID: {}", saved.getId());

        return ApiResponse.success("Maintenance request updated successfully.", toResponse(saved));
    }

    /**
     * Approves a PENDING maintenance request.
     */
    @Transactional
    public ApiResponse<MaintenanceResponse> approveMaintenance(Long id, Long performedBy) {
        log.info("Approving maintenance request ID: {}", id);
        return transitionStatus(id, performedBy, MaintenanceStatus.PENDING, MaintenanceStatus.APPROVED, "APPROVED", "Maintenance request approved");
    }

    /**
     * Rejects a PENDING maintenance request.
     */
    @Transactional
    public ApiResponse<MaintenanceResponse> rejectMaintenance(Long id, Long performedBy, String reason) {
        log.info("Rejecting maintenance request ID: {}", id);
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);

        if (maintenance == null) {
            return ApiResponse.error("Maintenance request not found with ID: " + id);
        }
        if (!MaintenanceStatus.PENDING.name().equals(maintenance.getStatus())) {
            return ApiResponse.error("Only PENDING requests can be rejected. Current status: " + maintenance.getStatus());
        }

        maintenance.setStatus(MaintenanceStatus.REJECTED.name());
        maintenance.setRemarks(reason);
        Maintenance saved = maintenanceRepository.save(maintenance);
        logHistory(saved, "REJECTED", performedBy, reason);
        log.info("Maintenance request ID: {} rejected", id);

        return ApiResponse.success("Maintenance request rejected.", toResponse(saved));
    }

    /**
     * Assigns a technician to an APPROVED maintenance request.
     */
    @Transactional
    public ApiResponse<MaintenanceResponse> assignTechnician(Long id, Long technicianId, Long performedBy) {
        log.info("Assigning technician ID: {} to maintenance ID: {}", technicianId, id);
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);

        if (maintenance == null) {
            return ApiResponse.error("Maintenance request not found with ID: " + id);
        }
        if (!MaintenanceStatus.APPROVED.name().equals(maintenance.getStatus())) {
            return ApiResponse.error("Technician can only be assigned to APPROVED requests. Current status: " + maintenance.getStatus());
        }

        maintenance.setTechnicianId(technicianId);
        maintenance.setStatus(MaintenanceStatus.TECHNICIAN_ASSIGNED.name());
        Maintenance saved = maintenanceRepository.save(maintenance);
        logHistory(saved, "TECHNICIAN_ASSIGNED", performedBy, "Technician ID " + technicianId + " assigned");
        log.info("Technician assigned to maintenance ID: {}", id);

        return ApiResponse.success("Technician assigned successfully.", toResponse(saved));
    }

    /**
     * Starts work on a TECHNICIAN_ASSIGNED maintenance request.
     */
    @Transactional
    public ApiResponse<MaintenanceResponse> startMaintenance(Long id, Long performedBy) {
        log.info("Starting maintenance work on ID: {}", id);
        return transitionStatus(id, performedBy, MaintenanceStatus.TECHNICIAN_ASSIGNED, MaintenanceStatus.IN_PROGRESS, "STARTED", "Maintenance work started");
    }

    /**
     * Resolves an IN_PROGRESS maintenance request.
     */
    @Transactional
    public ApiResponse<MaintenanceResponse> resolveMaintenance(Long id, Long performedBy, Double actualCost) {
        log.info("Resolving maintenance request ID: {}", id);
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);

        if (maintenance == null) {
            return ApiResponse.error("Maintenance request not found with ID: " + id);
        }
        if (!MaintenanceStatus.IN_PROGRESS.name().equals(maintenance.getStatus())) {
            return ApiResponse.error("Only IN_PROGRESS requests can be resolved. Current status: " + maintenance.getStatus());
        }

        maintenance.setStatus(MaintenanceStatus.RESOLVED.name());
        maintenance.setCompletedDate(LocalDate.now());
        if (actualCost != null) {
            maintenance.setActualCost(actualCost);
        }
        Maintenance saved = maintenanceRepository.save(maintenance);
        logHistory(saved, "RESOLVED", performedBy, "Maintenance resolved");
        log.info("Maintenance request ID: {} resolved", id);

        return ApiResponse.success("Maintenance request resolved.", toResponse(saved));
    }

    /**
     * Closes a RESOLVED maintenance request.
     */
    @Transactional
    public ApiResponse<MaintenanceResponse> closeMaintenance(Long id, Long performedBy) {
        log.info("Closing maintenance request ID: {}", id);
        return transitionStatus(id, performedBy, MaintenanceStatus.RESOLVED, MaintenanceStatus.CLOSED, "CLOSED", "Maintenance request closed");
    }

    /**
     * Retrieves the full action history for a maintenance request.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<MaintenanceHistory>> getMaintenanceHistory(Long maintenanceId) {
        log.info("Fetching history for maintenance ID: {}", maintenanceId);
        List<MaintenanceHistory> history = maintenanceHistoryRepository.findByMaintenanceIdOrderByCreatedAtDesc(maintenanceId);
        return ApiResponse.success("Maintenance history retrieved successfully.", history);
    }

    /**
     * Deletes a maintenance request (only PENDING or REJECTED).
     */
    @Transactional
    public ApiResponse<Void> deleteMaintenance(Long id) {
        log.info("Deleting maintenance request with ID: {}", id);
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);

        if (maintenance == null) {
            return ApiResponse.error("Maintenance request not found with ID: " + id);
        }

        if (!MaintenanceStatus.PENDING.name().equals(maintenance.getStatus()) && !MaintenanceStatus.REJECTED.name().equals(maintenance.getStatus())) {
            return ApiResponse.error("Only PENDING or REJECTED maintenance requests can be deleted. Current status: " + maintenance.getStatus());
        }

        maintenanceRepository.delete(maintenance);
        log.info("Maintenance request ID: {} deleted", id);

        return ApiResponse.success("Maintenance request deleted successfully.", null);
    }

    /**
     * Generic status transition helper.
     */
    private ApiResponse<MaintenanceResponse> transitionStatus(Long id, Long performedBy,
                                                               MaintenanceStatus expectedCurrent,
                                                               MaintenanceStatus newStatus,
                                                               String action, String remarks) {
        Maintenance maintenance = maintenanceRepository.findById(id).orElse(null);

        if (maintenance == null) {
            return ApiResponse.error("Maintenance request not found with ID: " + id);
        }
        if (!expectedCurrent.name().equals(maintenance.getStatus())) {
            return ApiResponse.error("Expected status " + expectedCurrent.name() + " but found " + maintenance.getStatus());
        }

        maintenance.setStatus(newStatus.name());
        Maintenance saved = maintenanceRepository.save(maintenance);
        logHistory(saved, action, performedBy, remarks);

        return ApiResponse.success("Status updated to " + newStatus.name() + ".", toResponse(saved));
    }

    /**
     * Persists a history entry for a maintenance action.
     */
    private void logHistory(Maintenance maintenance, String action, Long performedBy, String remarks) {
        MaintenanceHistory history = MaintenanceHistory.builder()
                .maintenance(maintenance)
                .action(action)
                .performedBy(performedBy)
                .remarks(remarks)
                .build();
        maintenanceHistoryRepository.save(history);
    }

    /**
     * Maps a Maintenance entity to MaintenanceResponse DTO.
     */
    private MaintenanceResponse toResponse(Maintenance m) {
        return MaintenanceResponse.builder()
                .id(m.getId())
                .assetId(m.getAssetId())
                .issueTitle(m.getIssueTitle())
                .issueDescription(m.getIssueDescription())
                .priority(m.getPriority())
                .raisedById(m.getRaisedById())
                .technicianId(m.getTechnicianId())
                .estimatedCost(m.getEstimatedCost())
                .actualCost(m.getActualCost())
                .maintenanceType(m.getMaintenanceType())
                .createdDate(m.getCreatedDate())
                .completedDate(m.getCompletedDate())
                .remarks(m.getRemarks())
                .status(m.getStatus())
                .build();
    }
}
