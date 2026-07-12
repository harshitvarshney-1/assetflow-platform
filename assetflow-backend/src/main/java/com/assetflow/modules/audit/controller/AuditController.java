package com.assetflow.modules.audit.controller;

import com.assetflow.dto.ApiResponse;
import com.assetflow.modules.audit.dto.*;
import com.assetflow.modules.audit.entity.AuditHistory;
import com.assetflow.modules.audit.service.AuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Audit Management operations.
 */
@RestController
@RequestMapping("/api/audits")
@RequiredArgsConstructor
public class AuditController {

    private static final Logger log = LoggerFactory.getLogger(AuditController.class);

    private final AuditService auditService;

    /**
     * Schedules a new audit cycle.
     * POST /api/audits
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AuditResponse>> scheduleAudit(@Valid @RequestBody AuditRequest request) {
        log.info("POST /api/audits - Scheduling audit: {}", request.getAuditName());
        ApiResponse<AuditResponse> response = auditService.scheduleAudit(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Retrieves all audit cycles.
     * GET /api/audits
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AuditResponse>>> getAllAudits() {
        log.info("GET /api/audits - Fetching all audit cycles");
        return ResponseEntity.ok(auditService.getAllAudits());
    }

    /**
     * Retrieves details of a specific audit.
     * GET /api/audits/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuditResponse>> getAuditById(@PathVariable Long id) {
        log.info("GET /api/audits/{} - Fetching audit details", id);
        ApiResponse<AuditResponse> response = auditService.getAuditById(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Starts an audit cycle.
     * PATCH /api/audits/{id}/start?performedBy={employeeId}
     */
    @PatchMapping("/{id}/start")
    public ResponseEntity<ApiResponse<AuditResponse>> startAudit(@PathVariable Long id, @RequestParam Long performedBy) {
        log.info("PATCH /api/audits/{}/start - Starting audit cycle", id);
        ApiResponse<AuditResponse> response = auditService.startAudit(id, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Audits/verifies an asset in the active audit cycle.
     * POST /api/audits/{id}/items?performedBy={employeeId}
     */
    @PostMapping("/{id}/items")
    public ResponseEntity<ApiResponse<AuditItemResponse>> verifyAsset(@PathVariable Long id,
                                                                       @Valid @RequestBody AuditItemRequest request,
                                                                       @RequestParam Long performedBy) {
        log.info("POST /api/audits/{}/items - Verifying asset ID: {}", id, request.getAssetId());
        ApiResponse<AuditItemResponse> response = auditService.verifyAsset(id, request, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Retrieves all audited items for a cycle.
     * GET /api/audits/{id}/items
     */
    @GetMapping("/{id}/items")
    public ResponseEntity<ApiResponse<List<AuditItemResponse>>> getAuditItems(@PathVariable Long id) {
        log.info("GET /api/audits/{}/items - Fetching items", id);
        return ResponseEntity.ok(auditService.getAuditItems(id));
    }

    /**
     * Completes an audit cycle.
     * PATCH /api/audits/{id}/complete?performedBy={employeeId}
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<AuditResponse>> completeAudit(@PathVariable Long id, @RequestParam Long performedBy) {
        log.info("PATCH /api/audits/{}/complete - Completing audit cycle", id);
        ApiResponse<AuditResponse> response = auditService.completeAudit(id, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Closes an audit cycle.
     * PATCH /api/audits/{id}/close?performedBy={employeeId}
     */
    @PatchMapping("/{id}/close")
    public ResponseEntity<ApiResponse<AuditResponse>> closeAudit(@PathVariable Long id, @RequestParam Long performedBy) {
        log.info("PATCH /api/audits/{}/close - Closing audit cycle", id);
        ApiResponse<AuditResponse> response = auditService.closeAudit(id, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Retrieves the history log of an audit cycle.
     * GET /api/audits/{id}/history
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<AuditHistory>>> getAuditHistory(@PathVariable Long id) {
        log.info("GET /api/audits/{}/history - Fetching history log", id);
        return ResponseEntity.ok(auditService.getAuditHistory(id));
    }
}
