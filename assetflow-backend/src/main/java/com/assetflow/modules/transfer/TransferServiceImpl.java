package com.assetflow.modules.transfer;

import com.assetflow.exception.AssetNotFoundException;
import com.assetflow.exception.TransferException;
import com.assetflow.modules.allocation.Allocation;
import com.assetflow.modules.allocation.AllocationRepository;
import com.assetflow.modules.allocation.AllocationStatus;
import com.assetflow.modules.asset.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransferServiceImpl implements TransferService {

    private final TransferRepository transferRepository;
    private final AssetRepository assetRepository;
    private final AllocationRepository allocationRepository;
    private final TransferMapper transferMapper;
    private final AssetService assetService;

    @Override
    @Transactional
    public TransferDTO requestTransfer(TransferRequestDTO dto) {
        log.info("Processing transfer request for asset ID: {} to: {}", dto.getAssetId(), dto.getToEmployee());

        Asset asset = assetRepository.findById(dto.getAssetId())
                .orElseThrow(() -> new AssetNotFoundException("Asset not found with ID: " + dto.getAssetId()));

        // Rule 1: Only Allocated Assets can be transferred
        if (asset.getStatus() != AssetStatus.ALLOCATED) {
            throw new TransferException("Only allocated assets can be transferred. Current status: " + asset.getStatus());
        }

        // Rule 2: Prevent duplicate transfer requests (checking active REQUESTED status)
        boolean hasPending = transferRepository.existsByAssetIdAndStatus(dto.getAssetId(), TransferStatus.REQUESTED);
        if (hasPending) {
            throw new TransferException("A pending transfer request already exists for this asset");
        }

        // Get current authenticated user
        String requestedBy = "System";
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                requestedBy = ((UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                requestedBy = (String) principal;
            }
        } catch (Exception ex) {
            log.warn("Failed to get current user for transfer request: {}", ex.getMessage());
        }

        Transfer transfer = transferMapper.toEntity(dto);
        transfer.setAsset(asset);
        transfer.setFromEmployee(asset.getCurrentHolder());
        transfer.setRequestedBy(requestedBy);
        transfer.setStatus(TransferStatus.REQUESTED);

        Transfer savedTransfer = transferRepository.save(transfer);
        log.info("Transfer request created successfully under ID: {} from: {} to: {}", savedTransfer.getId(), transfer.getFromEmployee(), transfer.getToEmployee());

        // Maintain Transfer History
        assetService.logHistory(
                asset.getId(),
                "TRANSFER_REQUESTED",
                "Transfer requested from " + transfer.getFromEmployee() + " to " + transfer.getToEmployee() + " by " + requestedBy + ". Reason: " + transfer.getReason()
        );

        return transferMapper.toDTO(savedTransfer);
    }

    @Override
    @Transactional
    public TransferDTO updateTransferStatus(UUID id, TransferUpdateDTO dto) {
        log.info("Updating transfer ID: {} to status: {} by: {}", id, dto.getStatus(), dto.getApprovedBy());

        Transfer transfer = transferRepository.findById(id)
                .orElseThrow(() -> new TransferException("Transfer record not found with ID: " + id));

        if (transfer.getStatus() != TransferStatus.REQUESTED) {
            throw new TransferException("Cannot update transfer. It is already in " + transfer.getStatus() + " status");
        }

        Asset asset = transfer.getAsset();
        transfer.setStatus(dto.getStatus());
        
        String username = dto.getApprovedBy();
        if (username == null || username.isBlank()) {
            username = "Approver";
            try {
                Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                if (principal instanceof UserDetails) {
                    username = ((UserDetails) principal).getUsername();
                } else if (principal instanceof String) {
                    username = (String) principal;
                }
            } catch (Exception ex) {
                log.warn("Failed to get current user for transfer status update: {}", ex.getMessage());
            }
        }
        transfer.setApprovedBy(username);

        // Rule 3: Transfer updates Current Holder automatically upon completion/approval
        if (dto.getStatus() == TransferStatus.APPROVED || dto.getStatus() == TransferStatus.COMPLETED) {
            // Update Asset holder
            String oldHolder = asset.getCurrentHolder();
            asset.setCurrentHolder(transfer.getToEmployee());
            assetRepository.save(asset);

            // Close active allocations for fromEmployee
            List<Allocation> activeAllocations = allocationRepository.findByEmployeeAndStatus(transfer.getFromEmployee(), AllocationStatus.ALLOCATED);
            for (Allocation alloc : activeAllocations) {
                if (alloc.getAsset().getId().equals(asset.getId())) {
                    alloc.setStatus(AllocationStatus.RETURNED);
                    alloc.setActualReturnDate(LocalDate.now());
                    allocationRepository.save(alloc);
                }
            }

            // Create new allocation for toEmployee
            Allocation newAllocation = new Allocation();
            newAllocation.setAsset(asset);
            newAllocation.setEmployee(transfer.getToEmployee());
            newAllocation.setDepartment(asset.getDepartment());
            newAllocation.setAllocatedDate(LocalDate.now());
            newAllocation.setExpectedReturnDate(LocalDate.now().plusMonths(6)); // default 6 month checkout
            newAllocation.setStatus(AllocationStatus.ALLOCATED);
            newAllocation.setNotes("Allocated via transfer request approval. Previous holder: " + oldHolder);
            allocationRepository.save(newAllocation);

            log.info("Transfer completed. Asset {} holder updated from {} to {}", asset.getAssetTag(), oldHolder, transfer.getToEmployee());

            // History Log
            assetService.logHistory(
                    asset.getId(),
                    "TRANSFER_COMPLETED",
                    "Transfer approved/completed by " + username + ". Asset holder updated from " + oldHolder + " to " + transfer.getToEmployee()
            );
        } else if (dto.getStatus() == TransferStatus.REJECTED) {
            log.info("Transfer ID: {} rejected by: {}", id, username);
            
            // History Log
            assetService.logHistory(
                    asset.getId(),
                    "TRANSFER_REJECTED",
                    "Transfer from " + transfer.getFromEmployee() + " to " + transfer.getToEmployee() + " rejected by " + username
            );
        }

        Transfer saved = transferRepository.save(transfer);
        return transferMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public TransferDTO getTransferById(UUID id) {
        log.debug("Fetching transfer record ID: {}", id);
        return transferRepository.findById(id)
                .map(transferMapper::toDTO)
                .orElseThrow(() -> new TransferException("Transfer record not found with ID: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransferDTO> getAllTransfers() {
        log.debug("Fetching all transfer records");
        return transferRepository.findAll().stream()
                .map(transferMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransferDTO> getTransferHistory(UUID assetId) {
        log.debug("Fetching transfer history for asset ID: {}", assetId);
        return transferRepository.findByAssetIdOrderByCreatedDateDesc(assetId).stream()
                .map(transferMapper::toDTO)
                .collect(Collectors.toList());
    }
}
