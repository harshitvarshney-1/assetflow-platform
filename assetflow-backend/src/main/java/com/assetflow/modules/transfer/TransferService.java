package com.assetflow.modules.transfer;

import java.util.List;
import java.util.UUID;

public interface TransferService {
    TransferDTO requestTransfer(TransferRequestDTO transferRequestDTO);
    TransferDTO updateTransferStatus(UUID id, TransferUpdateDTO transferUpdateDTO);
    TransferDTO getTransferById(UUID id);
    List<TransferDTO> getAllTransfers();
    List<TransferDTO> getTransferHistory(UUID assetId);
}
