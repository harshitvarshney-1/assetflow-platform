package com.assetflow.modules.allocation;

import com.assetflow.entity.BaseEntity;
import com.assetflow.modules.asset.Asset;
import com.assetflow.modules.asset.AssetCondition;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "return_logs")
@Getter
@Setter
public class ReturnLog extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "allocation_id")
    private Allocation allocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "return_date", nullable = false)
    private LocalDateTime returnDate;

    @Column(name = "returned_by", nullable = false)
    private String returnedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false)
    private AssetCondition condition;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;
}
