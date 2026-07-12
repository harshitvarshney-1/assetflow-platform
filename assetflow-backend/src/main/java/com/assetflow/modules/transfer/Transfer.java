package com.assetflow.modules.transfer;

import com.assetflow.entity.BaseEntity;
import com.assetflow.modules.asset.Asset;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "transfers")
@Getter
@Setter
public class Transfer extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "from_employee", nullable = false)
    private String fromEmployee;

    @Column(name = "to_employee", nullable = false)
    private String toEmployee;

    @Column(name = "requested_by", nullable = false)
    private String requestedBy;

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransferStatus status;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;
}
