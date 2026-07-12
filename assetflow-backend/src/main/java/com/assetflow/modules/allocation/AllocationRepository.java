package com.assetflow.modules.allocation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AllocationRepository extends JpaRepository<Allocation, UUID> {
    List<Allocation> findByAssetIdOrderByAllocatedDateDesc(UUID assetId);
    List<Allocation> findByEmployeeAndStatus(String employee, AllocationStatus status);
}
