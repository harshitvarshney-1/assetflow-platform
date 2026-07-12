package com.assetflow.modules.asset;

import com.assetflow.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    public ApiResponse<AssetDTO> createAsset(@Valid @RequestBody AssetCreateDTO dto) {
        AssetDTO created = assetService.createAsset(dto);
        return ApiResponse.success(created, "Asset created successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<AssetDTO> updateAsset(@PathVariable UUID id, @Valid @RequestBody AssetUpdateDTO dto) {
        AssetDTO updated = assetService.updateAsset(id, dto);
        return ApiResponse.success(updated, "Asset updated successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<AssetDTO> getAssetById(@PathVariable UUID id) {
        AssetDTO asset = assetService.getAssetById(id);
        return ApiResponse.success(asset, "Asset retrieved successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAsset(@PathVariable UUID id) {
        assetService.deleteAsset(id);
        return ApiResponse.success(null, "Asset soft-deleted successfully");
    }

    @GetMapping
    public ApiResponse<Page<AssetDTO>> getAllAssets(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) String serialNumber,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        Pageable pageable = parsePageable(page, size, sort);
        Page<AssetDTO> assets = assetService.getAllAssets(name, tag, serialNumber, category, department, status, location, pageable);
        return ApiResponse.success(assets, "Assets list retrieved successfully");
    }

    @GetMapping("/search")
    public ApiResponse<Page<AssetDTO>> searchAssets(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        Pageable pageable = parsePageable(page, size, sort);
        Page<AssetDTO> assets = assetService.searchAssets(query, pageable);
        return ApiResponse.success(assets, "Search completed successfully");
    }

    @GetMapping("/filter")
    public ApiResponse<Page<AssetDTO>> filterAssets(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate purchaseDateStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate purchaseDateEnd,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate warrantyExpiryStart,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate warrantyExpiryEnd,
            @RequestParam(required = false) AssetCondition condition,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {

        Pageable pageable = parsePageable(page, size, sort);
        Page<AssetDTO> assets = assetService.filterAssets(category, department, status, purchaseDateStart, purchaseDateEnd, warrantyExpiryStart, warrantyExpiryEnd, condition, pageable);
        return ApiResponse.success(assets, "Filtering completed successfully");
    }

    @GetMapping("/{id}/history")
    public ApiResponse<List<AssetHistory>> getAssetHistory(@PathVariable UUID id) {
        List<AssetHistory> history = assetService.getAssetHistory(id);
        return ApiResponse.success(history, "Asset history retrieved successfully");
    }

    private Pageable parsePageable(int page, int size, String sort) {
        String[] sortParams = sort.split(",");
        String property = sortParams[0];
        Sort.Direction direction = Sort.Direction.DESC;
        if (sortParams.length > 1 && "asc".equalsIgnoreCase(sortParams[1])) {
            direction = Sort.Direction.ASC;
        }
        return PageRequest.of(page, size, Sort.by(direction, property));
    }
}
