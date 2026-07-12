package com.assetflow.modules.audit.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * History record for audit cycle actions.
 */
@Entity
@Table(name = "audit_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "audit_id", nullable = false)
    private Audit audit;

    @Column(nullable = false)
    private String action;

    @Column(name = "performed_by", nullable = false)
    private Long performedBy;

    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
