package com.assetflow.modules.allocation;

import java.util.List;
import java.util.UUID;

public interface AllocationService {
    AllocationDTO allocateAsset(AllocationCreateDTO allocationCreateDTO);
    AllocationDTO updateAllocationStatus(UUID id, AllocationStatus status);
    AllocationDTO getAllocationById(UUID id);
    List<AllocationDTO> getAllAllocations();
    List<AllocationDTO> getAllocationHistory(UUID assetId);
    void deleteAllocation(UUID id);
    
    AllocationDTO returnAsset(UUID allocationId, AssetReturnDTO assetReturnDTO);
}
