package com.assetflow.modules.transfer;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TransferMapper {

    public TransferDTO toDTO(Transfer transfer) {
        if (transfer == null) {
            return null;
        }
        TransferDTO dto = new TransferDTO();
        dto.setId(transfer.getId());
        dto.setAssetId(transfer.getAsset().getId());
        dto.setAssetTag(transfer.getAsset().getAssetTag());
        dto.setAssetName(transfer.getAsset().getAssetName());
        dto.setFromEmployee(transfer.getFromEmployee());
        dto.setToEmployee(transfer.getToEmployee());
        dto.setRequestedBy(transfer.getRequestedBy());
        dto.setApprovedBy(transfer.getApprovedBy());
        dto.setReason(transfer.getReason());
        dto.setStatus(transfer.getStatus());
        dto.setCreatedDate(transfer.getCreatedDate());
        dto.setCreatedAt(transfer.getCreatedAt());
        dto.setUpdatedAt(transfer.getUpdatedAt());
        return dto;
    }

    public Transfer toEntity(TransferRequestDTO dto) {
        if (dto == null) {
            return null;
        }
        Transfer transfer = new Transfer();
        transfer.setToEmployee(dto.getToEmployee());
        transfer.setReason(dto.getReason());
        transfer.setStatus(TransferStatus.REQUESTED);
        transfer.setCreatedDate(LocalDateTime.now());
        return transfer;
    }
}
