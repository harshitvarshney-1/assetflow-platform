package com.assetflow.modules.maintenance.enums;

/**
 * Possible statuses for a maintenance request lifecycle.
 */
public enum MaintenanceStatus {
    PENDING,
    APPROVED,
    REJECTED,
    TECHNICIAN_ASSIGNED,
    IN_PROGRESS,
    RESOLVED,
    CLOSED
}
