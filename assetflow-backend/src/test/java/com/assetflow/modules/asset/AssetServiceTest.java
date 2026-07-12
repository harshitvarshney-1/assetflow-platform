package com.assetflow.modules.asset;

import com.assetflow.exception.DuplicateAssetException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AssetServiceTest {

    @Mock
    private AssetRepository assetRepository;

    @Mock
    private AssetHistoryRepository assetHistoryRepository;

    @Mock
    private AssetMapper assetMapper;

    @InjectMocks
    private AssetServiceImpl assetService;

    private AssetCreateDTO createDTO;
    private Asset asset;
    private AssetDTO assetDTO;

    @BeforeEach
    public void setup() {
        createDTO = new AssetCreateDTO();
        createDTO.setAssetName("Test Laptop");
        createDTO.setCategory("Laptops");
        createDTO.setDepartment("IT");
        createDTO.setSerialNumber("SN12345");
        createDTO.setPurchaseDate(LocalDate.now().minusDays(5));
        createDTO.setPurchaseCost(new BigDecimal("1200.00"));
        createDTO.setCondition(AssetCondition.NEW);
        createDTO.setStatus(AssetStatus.AVAILABLE);

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

        assetDTO = new AssetDTO();
        assetDTO.setId(asset.getId());
        assetDTO.setAssetTag("AST-2026-0001");
        assetDTO.setAssetName("Test Laptop");
        assetDTO.setSerialNumber("SN12345");
    }

    @Test
    public void testCreateAsset_Success() {
        when(assetRepository.existsBySerialNumber(createDTO.getSerialNumber())).thenReturn(false);
        when(assetMapper.toEntity(any(AssetCreateDTO.class))).thenReturn(asset);
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);
        when(assetMapper.toDTO(any(Asset.class))).thenReturn(assetDTO);
        when(assetRepository.findByAssetTag(anyString())).thenReturn(Optional.empty());

        AssetDTO saved = assetService.createAsset(createDTO);

        assertNotNull(saved);
        assertEquals("AST-2026-0001", saved.getAssetTag());
        verify(assetRepository, times(1)).save(any(Asset.class));
    }

    @Test
    public void testCreateAsset_DuplicateSerialNumber() {
        when(assetRepository.existsBySerialNumber(createDTO.getSerialNumber())).thenReturn(true);

        assertThrows(DuplicateAssetException.class, () -> assetService.createAsset(createDTO));
        verify(assetRepository, never()).save(any(Asset.class));
    }

    @Test
    public void testCreateAsset_InvalidWarrantyDate() {
        createDTO.setWarrantyExpiry(LocalDate.now().minusDays(10));
        assertThrows(IllegalArgumentException.class, () -> assetService.createAsset(createDTO));
        verify(assetRepository, never()).save(any(Asset.class));
    }

    @Test
    public void testDeleteAsset_Success() {
        when(assetRepository.findById(asset.getId())).thenReturn(Optional.of(asset));
        when(assetRepository.save(any(Asset.class))).thenReturn(asset);

        assetService.deleteAsset(asset.getId());

        assertTrue(asset.isDeleted());
        verify(assetRepository, times(1)).save(asset);
    }
}
