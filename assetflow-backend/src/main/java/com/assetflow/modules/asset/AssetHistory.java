package com.assetflow.modules.asset;

import com.assetflow.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "asset_history")
@Getter
@Setter
public class AssetHistory extends BaseEntity {

    @Column(name = "asset_id", nullable = false)
    private UUID assetId;

    @Column(name = "action", nullable = false)
    private String action;

    @Column(name = "action_by", nullable = false)
    private String actionBy;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "action_date", nullable = false)
    private LocalDateTime actionDate;
}
