package com.assetflow.modules.allocation;

import com.assetflow.exception.AllocationException;
import com.assetflow.modules.asset.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AllocationServiceTest {

    @Mock
    private AllocationRepository allocationRepository;

    @Mock
    private AssetRepository assetRepository;

    @Mock
    private ReturnLogRepository returnLogRepository;

    @Mock
    private AllocationMapper allocationMapper;

    @Mock
    private AssetService assetService;

    @InjectMocks
    private AllocationServiceImpl allocationService;

    private Asset asset;
    private AllocationCreateDTO createDTO;
    private Allocation allocation;
    private AllocationDTO allocationDTO;

    @BeforeEach
    public void setup() {
        asset = new Asset();
        asset.setId(UUID.randomUUID());
        asset.setAssetName("Test Laptop");
        asset.setCategory("Laptops");
        asset.setDepartment("IT");
        asset.setSerialNumber("SN12345");
        asset.setPurchaseDate(LocalDate.now().minusDays(5));
        asset.setPurchaseCost(new BigDecimal("1200.00"));
        asset.setCondition(AssetCondition.NEW);
        asset.setStatus(AssetStatus.AVAILABLE);
        asset.setAssetTag("AST-2026-0001");

        createDTO = new AllocationCreateDTO();
        createDTO.setAssetId(asset.getId());
        createDTO.setEmployee("John Doe");
        createDTO.setDepartment("Design");
        createDTO.setAllocatedDate(LocalDate.now());
        createDTO.setExpectedReturnDate(LocalDate.now().plusMonths(3));

        allocation = new Allocation();
        allocation.setId(UUID.randomUUID());
        allocation.setAsset(asset);
        allocation.setEmployee("John Doe");
        allocation.setDepartment("Design");
        allocation.setAllocatedDate(LocalDate.now());
        allocation.setExpectedReturnDate(LocalDate.now().plusMonths(3));
        allocation.setStatus(AllocationStatus.ALLOCATED);

        allocationDTO = new AllocationDTO();
        allocationDTO.setId(allocation.getId());
        allocationDTO.setEmployee("John Doe");
        allocationDTO.setStatus(AllocationStatus.ALLOCATED);
    }

    @Test
    public void testAllocateAsset_Success() {
        when(assetRepository.findById(asset.getId())).thenReturn(Optional.of(asset));
        when(allocationMapper.toEntity(any(AllocationCreateDTO.class))).thenReturn(allocation);
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);
        when(allocationRepository.save(any(Allocation.class))).thenReturn(allocation);
        when(allocationMapper.toDTO(any(Allocation.class))).thenReturn(allocationDTO);

        AllocationDTO saved = allocationService.allocateAsset(createDTO);

        assertNotNull(saved);
        assertEquals(AllocationStatus.ALLOCATED, saved.getStatus());
        assertEquals(AssetStatus.ALLOCATED, asset.getStatus());
        assertEquals("John Doe", asset.getCurrentHolder());
        verify(assetService, times(1)).logHistory(any(UUID.class), eq("ALLOCATED"), anyString());
    }

    @Test
    public void testAllocateAsset_AssetNotAvailable() {
        asset.setStatus(AssetStatus.ALLOCATED);
        when(assetRepository.findById(asset.getId())).thenReturn(Optional.of(asset));

        assertThrows(AllocationException.class, () -> allocationService.allocateAsset(createDTO));
        verify(allocationRepository, never()).save(any(Allocation.class));
    }

    @Test
    public void testAllocateAsset_InvalidExpectedReturnDate() {
        createDTO.setExpectedReturnDate(LocalDate.now().minusDays(1));
        when(assetRepository.findById(asset.getId())).thenReturn(Optional.of(asset));

        assertThrows(AllocationException.class, () -> allocationService.allocateAsset(createDTO));
        verify(allocationRepository, never()).save(any(Allocation.class));
    }

    @Test
    public void testReturnAsset_Success() {
        when(allocationRepository.findById(allocation.getId())).thenReturn(Optional.of(allocation));
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);
        when(allocationRepository.save(any(Allocation.class))).thenReturn(allocation);
        when(returnLogRepository.save(any(ReturnLog.class))).thenReturn(new ReturnLog());

        AssetReturnDTO returnDTO = new AssetReturnDTO();
        returnDTO.setReturnDate(LocalDateTime.now());
        returnDTO.setReturnedBy("John Doe");
        returnDTO.setCondition(AssetCondition.GOOD);
        returnDTO.setRemarks("Returned on time");

        allocationService.returnAsset(allocation.getId(), returnDTO);

        assertEquals(AllocationStatus.RETURNED, allocation.getStatus());
        assertEquals(AssetStatus.AVAILABLE, asset.getStatus());
        assertNull(asset.getCurrentHolder());
        assertEquals(AssetCondition.GOOD, asset.getCondition());

        verify(returnLogRepository, times(1)).save(any(ReturnLog.class));
        verify(assetService, times(1)).logHistory(any(UUID.class), eq("RETURNED"), anyString());
    }
}
