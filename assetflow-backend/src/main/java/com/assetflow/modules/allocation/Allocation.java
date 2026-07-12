package com.assetflow.modules.allocation;

import com.assetflow.entity.BaseEntity;
import com.assetflow.modules.asset.Asset;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "allocations")
@Getter
@Setter
public class Allocation extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id", nullable = false)
    private Asset asset;

    @Column(name = "employee", nullable = false)
    private String employee;

    @Column(name = "department", nullable = false)
    private String department;

    @Column(name = "allocated_date", nullable = false)
    private LocalDate allocatedDate;

    @Column(name = "expected_return_date", nullable = false)
    private LocalDate expectedReturnDate;

    @Column(name = "actual_return_date")
    private LocalDate actualReturnDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AllocationStatus status;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
}
