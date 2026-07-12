package com.assetflow.modules.asset;

import com.assetflow.exception.AssetNotFoundException;
import com.assetflow.exception.DuplicateAssetException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final AssetHistoryRepository assetHistoryRepository;
    private final AssetMapper assetMapper;

    @Override
    @Transactional
    public AssetDTO createAsset(AssetCreateDTO dto) {
        log.info("Creating asset: {}", dto.getAssetName());

        // 1. Validation: Serial Number Unique
        if (assetRepository.existsBySerialNumber(dto.getSerialNumber())) {
            throw new DuplicateAssetException("Serial number '" + dto.getSerialNumber() + "' already exists");
        }

        // 2. Validation: Warranty Expiry >= Purchase Date
        if (dto.getWarrantyExpiry() != null && dto.getWarrantyExpiry().isBefore(dto.getPurchaseDate())) {
            throw new IllegalArgumentException("Warranty expiry date cannot be before purchase date");
        }

        Asset asset = assetMapper.toEntity(dto);

        // 3. Auto Generate Asset Tag (AST-YYYY-XXXX)
        int year = LocalDate.now().getYear();
        long count = assetRepository.count();
        String tag;
        long seq = count + 1;
        do {
            tag = String.format("AST-%d-%04d", year, seq++);
        } while (assetRepository.findByAssetTag(tag).isPresent());
        
        asset.setAssetTag(tag);
        asset.setStatus(dto.getStatus() != null ? dto.getStatus() : AssetStatus.AVAILABLE);

        Asset savedAsset = assetRepository.save(asset);
        log.info("Asset created successfully with tag: {}", savedAsset.getAssetTag());

        // Log History
        logHistory(savedAsset.getId(), "CREATED", "Asset registered in the system under tag " + savedAsset.getAssetTag());

        return assetMapper.toDTO(savedAsset);
    }

    @Override
    @Transactional
    public AssetDTO updateAsset(UUID id, AssetUpdateDTO dto) {
        log.info("Updating asset: {} with ID: {}", dto.getAssetName(), id);

        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new AssetNotFoundException("Asset not found with ID: " + id));

        // 1. Validation: Serial Number Unique
        if (assetRepository.existsBySerialNumberAndIdNot(dto.getSerialNumber(), id)) {
            throw new DuplicateAssetException("Serial number '" + dto.getSerialNumber() + "' already exists for another asset");
        }

        // 2. Validation: Warranty Expiry >= Purchase Date
        if (dto.getWarrantyExpiry() != null && dto.getWarrantyExpiry().isBefore(dto.getPurchaseDate())) {
            throw new IllegalArgumentException("Warranty expiry date cannot be before purchase date");
        }

        // Keep old values to log changes if any
        AssetStatus oldStatus = asset.getStatus();
        String oldName = asset.getAssetName();

        assetMapper.updateEntity(asset, dto);
        Asset updatedAsset = assetRepository.save(asset);

        // Log History
        StringBuilder historyDesc = new StringBuilder("Asset details updated.");
        if (oldStatus != dto.getStatus()) {
            historyDesc.append(" Status changed from ").append(oldStatus).append(" to ").append(dto.getStatus()).append(".");
        }
        if (!oldName.equals(dto.getAssetName())) {
            historyDesc.append(" Name changed from '").append(oldName).append("' to '").append(dto.getAssetName()).append("'.");
        }
        logHistory(updatedAsset.getId(), "UPDATED", historyDesc.toString());

        return assetMapper.toDTO(updatedAsset);
    }

    @Override
    @Transactional(readOnly = true)
    public AssetDTO getAssetById(UUID id) {
        log.debug("Fetching asset by ID: {}", id);
        return assetRepository.findById(id)
                .map(assetMapper::toDTO)
                .orElseThrow(() -> new AssetNotFoundException("Asset not found with ID: " + id));
    }

    @Override
    @Transactional
    public void deleteAsset(UUID id) {
        log.info("Deleting asset ID: {}", id);
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new AssetNotFoundException("Asset not found with ID: " + id));
        
        asset.setDeleted(true);
        assetRepository.save(asset);
        
        logHistory(id, "DELETED", "Asset soft-deleted from the system.");
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AssetDTO> getAllAssets(String name, String tag, String serialNumber, String category, String department, String status, String location, Pageable pageable) {
        Specification<Asset> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));

            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("assetName")), "%" + name.toLowerCase() + "%"));
            }
            if (tag != null && !tag.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("assetTag")), "%" + tag.toLowerCase() + "%"));
            }
            if (serialNumber != null && !serialNumber.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("serialNumber")), serialNumber.toLowerCase()));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.toLowerCase()));
            }
            if (department != null && !department.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("department")), department.toLowerCase()));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.toLowerCase()));
            }
            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return assetRepository.findAll(spec, pageable).map(assetMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AssetDTO> searchAssets(String query, Pageable pageable) {
        Specification<Asset> spec = (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));

            if (query != null && !query.isBlank()) {
                String pattern = "%" + query.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("assetName")), pattern),
                        cb.like(cb.lower(root.get("assetTag")), pattern),
                        cb.like(cb.lower(root.get("serialNumber")), pattern),
                        cb.like(cb.lower(root.get("department")), pattern),
                        cb.like(cb.lower(root.get("category")), pattern),
                        cb.like(cb.lower(root.get("location")), pattern)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return assetRepository.findAll(spec, pageable).map(assetMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AssetDTO> filterAssets(String category, String department, String status, LocalDate purchaseDateStart, LocalDate purchaseDateEnd, LocalDate warrantyExpiryStart, LocalDate warrantyExpiryEnd, AssetCondition condition, Pageable pageable) {
        Specification<Asset> spec = (root, q, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("deleted"), false));

            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.toLowerCase()));
            }
            if (department != null && !department.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("department")), department.toLowerCase()));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("status")), status.toLowerCase()));
            }
            if (condition != null) {
                predicates.add(cb.equal(root.get("condition"), condition));
            }
            if (purchaseDateStart != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("purchaseDate"), purchaseDateStart));
            }
            if (purchaseDateEnd != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("purchaseDate"), purchaseDateEnd));
            }
            if (warrantyExpiryStart != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("warrantyExpiry"), warrantyExpiryStart));
            }
            if (warrantyExpiryEnd != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("warrantyExpiry"), warrantyExpiryEnd));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return assetRepository.findAll(spec, pageable).map(assetMapper::toDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssetHistory> getAssetHistory(UUID assetId) {
        log.debug("Fetching history for asset ID: {}", assetId);
        return assetHistoryRepository.findByAssetIdOrderByActionDateDesc(assetId);
    }

    @Override
    @Transactional
    public void logHistory(UUID assetId, String action, String description) {
        String username = "System";
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (principal instanceof UserDetails) {
                username = ((UserDetails) principal).getUsername();
            } else if (principal instanceof String) {
                username = (String) principal;
            }
        } catch (Exception ex) {
            log.warn("Failed to get current user for history log: {}", ex.getMessage());
        }

        AssetHistory history = new AssetHistory();
        history.setAssetId(assetId);
        history.setAction(action);
        history.setActionBy(username);
        history.setDescription(description);
        history.setActionDate(LocalDateTime.now());
        
        assetHistoryRepository.save(history);
        log.info("History logged - Asset ID: {}, Action: {}, User: {}", assetId, action, username);
    }
}
