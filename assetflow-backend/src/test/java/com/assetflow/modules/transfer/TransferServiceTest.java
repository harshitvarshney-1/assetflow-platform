package com.assetflow.modules.transfer;

import com.assetflow.exception.TransferException;
import com.assetflow.modules.allocation.Allocation;
import com.assetflow.modules.allocation.AllocationRepository;
import com.assetflow.modules.allocation.AllocationStatus;
import com.assetflow.modules.asset.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransferServiceTest {

    @Mock
    private TransferRepository transferRepository;

    @Mock
    private AssetRepository assetRepository;

    @Mock
    private AllocationRepository allocationRepository;

    @Mock
    private TransferMapper transferMapper;

    @Mock
    private AssetService assetService;

    @InjectMocks
    private TransferServiceImpl transferService;

    private Asset asset;
    private TransferRequestDTO requestDTO;
    private Transfer transfer;
    private TransferDTO transferDTO;
    private Allocation activeAllocation;

    @BeforeEach
    public void setup() {
        asset = new Asset();
        asset.setId(UUID.randomUUID());
        asset.setAssetName("Test Laptop");
        asset.setStatus(AssetStatus.ALLOCATED);
        asset.setCurrentHolder("Alice");
        asset.setDepartment("IT");

        requestDTO = new TransferRequestDTO();
        requestDTO.setAssetId(asset.getId());
        requestDTO.setToEmployee("Bob");
        requestDTO.setReason("Project switch");

        transfer = new Transfer();
        transfer.setId(UUID.randomUUID());
        transfer.setAsset(asset);
        transfer.setFromEmployee("Alice");
        transfer.setToEmployee("Bob");
        transfer.setReason("Project switch");
        transfer.setStatus(TransferStatus.REQUESTED);

        transferDTO = new TransferDTO();
        transferDTO.setId(transfer.getId());
        transferDTO.setFromEmployee("Alice");
        transferDTO.setToEmployee("Bob");
        transferDTO.setStatus(TransferStatus.REQUESTED);

        activeAllocation = new Allocation();
        activeAllocation.setId(UUID.randomUUID());
        activeAllocation.setAsset(asset);
        activeAllocation.setEmployee("Alice");
        activeAllocation.setStatus(AllocationStatus.ALLOCATED);
    }

    @Test
    public void testRequestTransfer_Success() {
        when(assetRepository.findById(asset.getId())).thenReturn(Optional.of(asset));
        when(transferRepository.existsByAssetIdAndStatus(asset.getId(), TransferStatus.REQUESTED)).thenReturn(false);
        when(transferMapper.toEntity(any(TransferRequestDTO.class))).thenReturn(transfer);
        when(transferRepository.save(any(Transfer.class))).thenReturn(transfer);
        when(transferMapper.toDTO(any(Transfer.class))).thenReturn(transferDTO);

        TransferDTO result = transferService.requestTransfer(requestDTO);

        assertNotNull(result);
        assertEquals("Alice", result.getFromEmployee());
        assertEquals("Bob", result.getToEmployee());
        verify(assetService, times(1)).logHistory(any(UUID.class), eq("TRANSFER_REQUESTED"), anyString());
    }

    @Test
    public void testRequestTransfer_AssetNotAllocated() {
        asset.setStatus(AssetStatus.AVAILABLE);
        when(assetRepository.findById(asset.getId())).thenReturn(Optional.of(asset));

        assertThrows(TransferException.class, () -> transferService.requestTransfer(requestDTO));
        verify(transferRepository, never()).save(any(Transfer.class));
    }

    @Test
    public void testRequestTransfer_DuplicatePendingRequest() {
        when(assetRepository.findById(asset.getId())).thenReturn(Optional.of(asset));
        when(transferRepository.existsByAssetIdAndStatus(asset.getId(), TransferStatus.REQUESTED)).thenReturn(true);

        assertThrows(TransferException.class, () -> transferService.requestTransfer(requestDTO));
        verify(transferRepository, never()).save(any(Transfer.class));
    }

    @Test
    public void testUpdateTransferStatus_Approved() {
        when(transferRepository.findById(transfer.getId())).thenReturn(Optional.of(transfer));
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);
        when(allocationRepository.findByEmployeeAndStatus("Alice", AllocationStatus.ALLOCATED))
                .thenReturn(Collections.singletonList(activeAllocation));
        when(allocationRepository.save(any(Allocation.class))).thenReturn(activeAllocation);
        when(transferRepository.save(any(Transfer.class))).thenReturn(transfer);
        when(transferMapper.toDTO(any(Transfer.class))).thenReturn(transferDTO);

        TransferUpdateDTO updateDTO = new TransferUpdateDTO();
        updateDTO.setStatus(TransferStatus.APPROVED);
        updateDTO.setApprovedBy("Manager");

        transferService.updateTransferStatus(transfer.getId(), updateDTO);

        assertEquals(TransferStatus.APPROVED, transfer.getStatus());
        assertEquals("Bob", asset.getCurrentHolder());
        assertEquals(AllocationStatus.RETURNED, activeAllocation.getStatus());
        
        verify(allocationRepository, atLeastOnce()).save(any(Allocation.class));
        verify(assetService, times(1)).logHistory(any(UUID.class), eq("TRANSFER_COMPLETED"), anyString());
    }
}
