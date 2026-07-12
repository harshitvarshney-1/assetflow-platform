package com.assetflow.modules.allocation;

import com.assetflow.exception.AllocationException;
import com.assetflow.exception.AssetNotFoundException;
import com.assetflow.modules.asset.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AllocationServiceImpl implements AllocationService {

    private final AllocationRepository allocationRepository;
    private final AssetRepository assetRepository;
    private final ReturnLogRepository returnLogRepository;
    private final AllocationMapper allocationMapper;
    private final AssetService assetService;

    @Override
    @Transactional
    public AllocationDTO allocateAsset(AllocationCreateDTO dto) {
        log.info("Processing allocation request for asset: {} by employee: {}", dto.getAssetId(), dto.getEmployee());

        Asset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new AssetNotFoundException("Asset not found with ID: " + dto.getAssetId()));

        // Rule 1: Only Available assets can be allocated
        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new AllocationException("Asset is not available for allocation. Current status: " + asset.getStatus());
        }

        // Rule 2: Expected Return Date cannot be before Allocation Date
        if (dto.getExpectedReturnDate().isBefore(dto.getAllocatedDate())) {
            throw new AllocationException("Expected return date cannot be before allocation date");
        }

        Allocation allocation = allocationMapper.toEntity(dto);
        allocation.setAsset(asset);
        allocation.setStatus(AllocationStatus.ALLOCATED); // Immediately active

        // Update Asset details
        asset.setStatus(AssetStatus.ALLOCATED);
        asset.setCurrentHolder(dto.getEmployee());
        assetRepository.save(asset);

        Allocation savedAllocation = allocationRepository.save(allocation);
        log.info("Asset {} successfully allocated to employee: {} under allocation ID: {}", asset.getAssetTag(), dto.getEmployee(), savedAllocation.getId());

        // Maintain Allocation History
        assetService.logHistory(
                asset.getId(), 
                "ALLOCATED", 
                "Asset allocated to " + dto.getEmployee() + " (" + dto.getDepartment() + "). Expected return: " + dto.getExpectedReturnDate()
        );

        return allocationMapper.toDTO(savedAllocation);
    }

    @Override
    @Transactional
    public AllocationDTO updateAllocationStatus(UUID id, AllocationStatus status) {
        log.info("Updating status of allocation ID: {} to status: {}", id, status);
        Allocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new AllocationException("Allocation record not found with ID: " + id));

        AllocationStatus oldStatus = allocation.getStatus();
        allocation.setStatus(status);
        Allocation saved = allocationRepository.save(allocation);

        assetService.logHistory(
                allocation.getAsset().getId(),
                "ALLOCATION_STATUS_UPDATED",
                "Allocation status updated from " + oldStatus + " to " + status
        );

        return allocationMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AllocationDTO getAllocationById(UUID id) {
        log.debug("Fetching allocation record by ID: {}", id);
        return allocationRepository.findById(id)
                .map(allocationMapper::toDTO)
                .orElseThrow(() -> new AllocationException("Allocation record not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AllocationDTO> getAllAllocations() {
        log.debug("Fetching all allocation records");
        return allocationRepository.findAll().stream()
                .map(allocationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AllocationDTO> getAllocationHistory(UUID assetId) {
        log.debug("Fetching allocation history for asset ID: {}", assetId);
        return allocationRepository.findByAssetIdOrderByAllocatedDateDesc(assetId).stream()
                .map(allocationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAllocation(UUID id) {
        log.info("Deleting allocation record: {}", id);
        Allocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new AllocationException("Allocation record not found with ID: " + id));
        allocationRepository.delete(allocation);
    }

    @Override
    @Transactional
    public AllocationDTO returnAsset(UUID allocationId, AssetReturnDTO dto) {
        log.info("Processing return request for allocation ID: {} by: {}", allocationId, dto.getReturnedBy());

        Allocation allocation = allocationRepository.findById(allocationId)
                .orElseThrow(() -> new AllocationException("Allocation record not found with ID: " + allocationId));

        if (allocation.getStatus() != AllocationStatus.ALLOCATED) {
            throw new AllocationException("Cannot return asset. Allocation is not active. Current status: " + allocation.getStatus());
        }

        Asset asset = allocation.getAsset();

        // 1. Returned Asset becomes Available. Update condition.
        asset.setStatus(AssetStatus.AVAILABLE);
        asset.setCondition(dto.getCondition());
        asset.setCurrentHolder(null);
        assetRepository.save(asset);

        // 2. Allocation automatically closes
        allocation.setStatus(AllocationStatus.RETURNED);
        allocation.setActualReturnDate(dto.getReturnDate().toLocalDate());
        Allocation savedAllocation = allocationRepository.save(allocation);

        // 3. Generate Return Log
        ReturnLog returnLog = new ReturnLog();
        returnLog.setAllocation(allocation);
        returnLog.setAsset(asset);
        returnLog.setReturnDate(dto.getReturnDate());
        returnLog.setReturnedBy(dto.getReturnedBy());
        returnLog.setCondition(dto.getCondition());
        returnLog.setRemarks(dto.getRemarks());
        returnLogRepository.save(returnLog);

        log.info("Asset {} returned successfully. Condition: {}", asset.getAssetTag(), dto.getCondition());

        // Log History
        assetService.logHistory(
                asset.getId(),
                "RETURNED",
                "Asset returned by " + dto.getReturnedBy() + ". Condition: " + dto.getCondition() + ". Remarks: " + dto.getRemarks()
        );

        return allocationMapper.toDTO(savedAllocation);
    }
}
