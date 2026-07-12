package com.assetflow.modules.allocation;

import org.springframework.stereotype.Component;

@Component
public class AllocationMapper {

    public AllocationDTO toDTO(Allocation allocation) {
        if (allocation == null) {
            return null;
        }
        AllocationDTO dto = new AllocationDTO();
        dto.setId(allocation.getId());
        dto.setAssetId(allocation.getAsset().getId());
        dto.setAssetTag(allocation.getAsset().getAssetTag());
        dto.setAssetName(allocation.getAsset().getAssetName());
        dto.setEmployee(allocation.getEmployee());
        dto.setDepartment(allocation.getDepartment());
        dto.setAllocatedDate(allocation.getAllocatedDate());
        dto.setExpectedReturnDate(allocation.getExpectedReturnDate());
        dto.setActualReturnDate(allocation.getActualReturnDate());
        dto.setStatus(allocation.getStatus());
        dto.setNotes(allocation.getNotes());
        dto.setCreatedAt(allocation.getCreatedAt());
        dto.setUpdatedAt(allocation.getUpdatedAt());
        return dto;
    }

    public Allocation toEntity(AllocationCreateDTO dto) {
        if (dto == null) {
            return null;
        }
        Allocation allocation = new Allocation();
        allocation.setEmployee(dto.getEmployee());
        allocation.setDepartment(dto.getDepartment());
        allocation.setAllocatedDate(dto.getAllocatedDate());
        allocation.setExpectedReturnDate(dto.getExpectedReturnDate());
        allocation.setNotes(dto.getNotes());
        allocation.setStatus(AllocationStatus.PENDING);
        return allocation;
    }
}
