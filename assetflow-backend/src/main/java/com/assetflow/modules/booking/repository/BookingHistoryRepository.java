package com.assetflow.modules.booking.repository;

import com.assetflow.modules.booking.entity.BookingHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// 1. File Name: BookingHistoryRepository.java
// 2. Folder Location: assetflow-backend/src/main/java/com/assetflow/modules/booking/repository
// 3. Purpose: Repository interface for BookingHistory entity.

@Repository
public interface BookingHistoryRepository extends JpaRepository<BookingHistory, Long> {
    List<BookingHistory> findByBookingIdOrderByCreatedAtDesc(Long bookingId);
}
