package com.assetflow.modules.audit.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents an audit cycle.
 */
@Entity
@Table(name = "audits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Audit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Audit ID

    @Column(name = "audit_name", nullable = false, length = 200)
    private String auditName;

    @Column(name = "department_id", nullable = false)
    private Long departmentId;

    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "assigned_auditor_id", nullable = false)
    private Long assignedAuditorId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private com.assetflow.modules.audit.enums.AuditStatus status;

    @Column(length = 500)
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

