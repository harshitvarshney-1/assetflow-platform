package com.assetflow.modules.maintenance.controller;

import com.assetflow.dto.ApiResponse;
import com.assetflow.modules.maintenance.dto.MaintenanceRequest;
import com.assetflow.modules.maintenance.dto.MaintenanceResponse;
import com.assetflow.modules.maintenance.entity.MaintenanceHistory;
import com.assetflow.modules.maintenance.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Maintenance Management operations.
 */
@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    private static final Logger log = LoggerFactory.getLogger(MaintenanceController.class);

    private final MaintenanceService maintenanceService;

    /**
     * Creates a new maintenance request.
     * POST /api/maintenance
     */
    @PostMapping
    public ResponseEntity<ApiResponse<MaintenanceResponse>> createMaintenance(@Valid @RequestBody MaintenanceRequest request) {
        log.info("POST /api/maintenance - Creating maintenance request for asset ID: {}", request.getAssetId());
        ApiResponse<MaintenanceResponse> response = maintenanceService.createMaintenance(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Retrieves all maintenance requests.
     * GET /api/maintenance
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MaintenanceResponse>>> getAllMaintenance() {
        log.info("GET /api/maintenance - Fetching all maintenance requests");
        return ResponseEntity.ok(maintenanceService.getAllMaintenance());
    }

    /**
     * Retrieves a single maintenance request by ID.
     * GET /api/maintenance/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> getMaintenanceById(@PathVariable Long id) {
        log.info("GET /api/maintenance/{} - Fetching maintenance request", id);
        ApiResponse<MaintenanceResponse> response = maintenanceService.getMaintenanceById(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Updates an existing maintenance request.
     * PUT /api/maintenance/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> updateMaintenance(@PathVariable Long id, @Valid @RequestBody MaintenanceRequest request) {
        log.info("PUT /api/maintenance/{} - Updating maintenance request", id);
        ApiResponse<MaintenanceResponse> response = maintenanceService.updateMaintenance(id, request);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Approves a PENDING maintenance request.
     * PATCH /api/maintenance/{id}/approve?performedBy={employeeId}
     */
    @PatchMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> approveMaintenance(@PathVariable Long id, @RequestParam Long performedBy) {
        log.info("PATCH /api/maintenance/{}/approve", id);
        ApiResponse<MaintenanceResponse> response = maintenanceService.approveMaintenance(id, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Rejects a PENDING maintenance request.
     * PATCH /api/maintenance/{id}/reject?performedBy={employeeId}&reason={reason}
     */
    @PatchMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> rejectMaintenance(@PathVariable Long id,
                                                                               @RequestParam Long performedBy,
                                                                               @RequestParam(required = false, defaultValue = "Rejected") String reason) {
        log.info("PATCH /api/maintenance/{}/reject", id);
        ApiResponse<MaintenanceResponse> response = maintenanceService.rejectMaintenance(id, performedBy, reason);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Assigns a technician to an APPROVED maintenance request.
     * PATCH /api/maintenance/{id}/assign-technician?technicianId={id}&performedBy={employeeId}
     */
    @PatchMapping("/{id}/assign-technician")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> assignTechnician(@PathVariable Long id,
                                                                              @RequestParam Long technicianId,
                                                                              @RequestParam Long performedBy) {
        log.info("PATCH /api/maintenance/{}/assign-technician - technician ID: {}", id, technicianId);
        ApiResponse<MaintenanceResponse> response = maintenanceService.assignTechnician(id, technicianId, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Starts work on a TECHNICIAN_ASSIGNED maintenance request.
     * PATCH /api/maintenance/{id}/start?performedBy={employeeId}
     */
    @PatchMapping("/{id}/start")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> startMaintenance(@PathVariable Long id, @RequestParam Long performedBy) {
        log.info("PATCH /api/maintenance/{}/start", id);
        ApiResponse<MaintenanceResponse> response = maintenanceService.startMaintenance(id, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Resolves an IN_PROGRESS maintenance request.
     * PATCH /api/maintenance/{id}/resolve?performedBy={employeeId}&actualCost={cost}
     */
    @PatchMapping("/{id}/resolve")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> resolveMaintenance(@PathVariable Long id,
                                                                                @RequestParam Long performedBy,
                                                                                @RequestParam(required = false) Double actualCost) {
        log.info("PATCH /api/maintenance/{}/resolve", id);
        ApiResponse<MaintenanceResponse> response = maintenanceService.resolveMaintenance(id, performedBy, actualCost);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Closes a RESOLVED maintenance request.
     * PATCH /api/maintenance/{id}/close?performedBy={employeeId}
     */
    @PatchMapping("/{id}/close")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> closeMaintenance(@PathVariable Long id, @RequestParam Long performedBy) {
        log.info("PATCH /api/maintenance/{}/close", id);
        ApiResponse<MaintenanceResponse> response = maintenanceService.closeMaintenance(id, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Retrieves the action history for a maintenance request.
     * GET /api/maintenance/{id}/history
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<MaintenanceHistory>>> getMaintenanceHistory(@PathVariable Long id) {
        log.info("GET /api/maintenance/{}/history", id);
        return ResponseEntity.ok(maintenanceService.getMaintenanceHistory(id));
    }

    /**
     * Deletes a maintenance request (only PENDING or REJECTED).
     * DELETE /api/maintenance/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMaintenance(@PathVariable Long id) {
        log.info("DELETE /api/maintenance/{}", id);
        ApiResponse<Void> response = maintenanceService.deleteMaintenance(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }
}
