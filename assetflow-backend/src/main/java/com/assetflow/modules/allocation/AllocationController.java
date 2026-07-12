package com.assetflow.modules.allocation;

import com.assetflow.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/allocations")
@RequiredArgsConstructor
public class AllocationController {

    private final AllocationService allocationService;

    @PostMapping
    public ApiResponse<AllocationDTO> allocateAsset(@Valid @RequestBody AllocationCreateDTO dto) {
        AllocationDTO created = allocationService.allocateAsset(dto);
        return ApiResponse.success(created, "Asset allocated successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<AllocationDTO> updateAllocationStatus(
            @PathVariable UUID id,
            @RequestParam AllocationStatus status) {
        AllocationDTO updated = allocationService.updateAllocationStatus(id, status);
        return ApiResponse.success(updated, "Allocation status updated successfully");
    }

    @GetMapping("/{id}")
    public ApiResponse<AllocationDTO> getAllocationById(@PathVariable UUID id) {
        AllocationDTO allocation = allocationService.getAllocationById(id);
        return ApiResponse.success(allocation, "Allocation record retrieved successfully");
    }

    @GetMapping
    public ApiResponse<List<AllocationDTO>> getAllAllocations() {
        List<AllocationDTO> allocations = allocationService.getAllAllocations();
        return ApiResponse.success(allocations, "Allocations retrieved successfully");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteAllocation(@PathVariable UUID id) {
        allocationService.deleteAllocation(id);
        return ApiResponse.success(null, "Allocation record deleted successfully");
    }

    @GetMapping("/history/{assetId}")
    public ApiResponse<List<AllocationDTO>> getAllocationHistory(@PathVariable UUID assetId) {
        List<AllocationDTO> history = allocationService.getAllocationHistory(assetId);
        return ApiResponse.success(history, "Allocation history retrieved successfully");
    }

    @PostMapping("/{id}/return")
    public ApiResponse<AllocationDTO> returnAsset(
            @PathVariable UUID id,
            @Valid @RequestBody AssetReturnDTO returnDto) {
        AllocationDTO returned = allocationService.returnAsset(id, returnDto);
        return ApiResponse.success(returned, "Asset returned and allocation closed successfully");
    }
}
