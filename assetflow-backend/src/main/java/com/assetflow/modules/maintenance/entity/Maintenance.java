package com.assetflow.modules.maintenance.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Maintenance record for an asset.
 */
@Entity
@Table(name = "maintenance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "asset_id", nullable = false)
    private Long assetId;

    @Column(name = "issue_title", nullable = false)
    private String issueTitle;

    @Column(name = "issue_description", columnDefinition = "TEXT")
    private String issueDescription;

    @Column(name = "priority", nullable = false)
    private String priority; // LOW, MEDIUM, HIGH, CRITICAL

    @Column(name = "raised_by", nullable = false)
    private Long raisedById;

    @Column(name = "assigned_technician_id")
    private Long technicianId;

    @Column(name = "estimated_cost")
    private Double estimatedCost;

    @Column(name = "actual_cost")
    private Double actualCost;

    @Column(name = "maintenance_type")
    private String maintenanceType;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;

    @Column(name = "completed_date")
    private LocalDate completedDate;

    @Column(length = 500)
    private String remarks;

    @Column(name = "status", nullable = false)
    private String status; // PENDING, APPROVED, REJECTED, TECHNICIAN_ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED
}
