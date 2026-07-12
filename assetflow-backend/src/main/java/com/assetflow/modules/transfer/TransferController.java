package com.assetflow.modules.transfer;

import com.assetflow.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferService transferService;

    @PostMapping
    public ApiResponse<TransferDTO> requestTransfer(@Valid @RequestBody TransferRequestDTO dto) {
        TransferDTO created = transferService.requestTransfer(dto);
        return ApiResponse.success(created, "Transfer request submitted successfully");
    }

    @PutMapping("/{id}")
    public ApiResponse<TransferDTO> updateTransferStatus(
            @PathVariable UUID id,
            @Valid @RequestBody TransferUpdateDTO dto) {
        TransferDTO updated = transferService.updateTransferStatus(id, dto);
        String msg = dto.getStatus() == TransferStatus.APPROVED ? "Transfer request approved" : "Transfer request status updated";
        return ApiResponse.success(updated, msg);
    }

    @GetMapping("/{id}")
    public ApiResponse<TransferDTO> getTransferById(@PathVariable UUID id) {
        TransferDTO transfer = transferService.getTransferById(id);
        return ApiResponse.success(transfer, "Transfer record retrieved successfully");
    }

    @GetMapping
    public ApiResponse<List<TransferDTO>> getAllTransfers() {
        List<TransferDTO> transfers = transferService.getAllTransfers();
        return ApiResponse.success(transfers, "Transfers retrieved successfully");
    }

    @GetMapping("/history/{assetId}")
    public ApiResponse<List<TransferDTO>> getTransferHistory(@PathVariable UUID assetId) {
        List<TransferDTO> history = transferService.getTransferHistory(assetId);
        return ApiResponse.success(history, "Transfer history retrieved successfully");
    }
}
