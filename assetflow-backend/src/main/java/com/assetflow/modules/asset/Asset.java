package com.assetflow.modules.asset;

import com.assetflow.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "assets")
@SQLDelete(sql = "UPDATE assets SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
@Getter
@Setter
public class Asset extends BaseEntity {

    @Column(name = "asset_tag", unique = true, nullable = false)
    private String assetTag;

    @Column(name = "asset_name", nullable = false)
    private String assetName;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "current_holder")
    private String currentHolder;

    @Column(name = "serial_number", unique = true, nullable = false)
    private String serialNumber;

    @Column(name = "purchase_date", nullable = false)
    private LocalDate purchaseDate;

    @Column(name = "purchase_cost", nullable = false)
    private BigDecimal purchaseCost;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "model_number")
    private String modelNumber;

    @Column(name = "warranty_expiry")
    private LocalDate warrantyExpiry;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false)
    private AssetCondition condition;

    @Column(name = "location")
    private String location;

    @Column(name = "image")
    private String image;

    @Column(name = "documents")
    private String documents;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AssetStatus status;

    @Column(name = "deleted", nullable = false)
    private boolean deleted = false;
}
