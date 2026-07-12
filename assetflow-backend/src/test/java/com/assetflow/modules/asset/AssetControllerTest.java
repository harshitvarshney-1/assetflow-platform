package com.assetflow.modules.asset;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AssetController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AssetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AssetService assetService;

    @MockBean
    private com.assetflow.security.JwtProvider jwtProvider;

    @MockBean
    private UserDetailsService userDetailsService;

    private AssetDTO assetDTO;

    @BeforeEach
    public void setup() {
        assetDTO = new AssetDTO();
        assetDTO.setId(UUID.randomUUID());
        assetDTO.setAssetTag("AST-2026-0001");
        assetDTO.setAssetName("Test Laptop");
        assetDTO.setSerialNumber("SN12345");
        assetDTO.setCategory("Laptops");
        assetDTO.setDepartment("IT");
        assetDTO.setPurchaseDate(LocalDate.now());
        assetDTO.setPurchaseCost(new BigDecimal("1200.00"));
        assetDTO.setCondition(AssetCondition.NEW);
        assetDTO.setStatus(AssetStatus.AVAILABLE);
    }

    @Test
    public void testGetAssetById_Success() throws Exception {
        UUID id = assetDTO.getId();
        when(assetService.getAssetById(id)).thenReturn(assetDTO);

        mockMvc.perform(get("/assets/{id}", id)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.assetName").value("Test Laptop"))
                .andExpect(jsonPath("$.data.assetTag").value("AST-2026-0001"));
    }

    @Test
    public void testCreateAsset_Success() throws Exception {
        AssetCreateDTO createDTO = new AssetCreateDTO();
        createDTO.setAssetName("Test Laptop");
        createDTO.setCategory("Laptops");
        createDTO.setDepartment("IT");
        createDTO.setSerialNumber("SN12345");
        createDTO.setPurchaseDate(LocalDate.now());
        createDTO.setPurchaseCost(new BigDecimal("1200.00"));
        createDTO.setCondition(AssetCondition.NEW);
        createDTO.setStatus(AssetStatus.AVAILABLE);

        when(assetService.createAsset(any(AssetCreateDTO.class))).thenReturn(assetDTO);

        mockMvc.perform(post("/assets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Asset created successfully"));
    }

    @Test
    public void testCreateAsset_ValidationFailure() throws Exception {
        AssetCreateDTO createDTO = new AssetCreateDTO();
        
        mockMvc.perform(post("/assets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createDTO)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
