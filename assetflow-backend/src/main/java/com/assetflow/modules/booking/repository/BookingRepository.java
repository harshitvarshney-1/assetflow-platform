package com.assetflow.modules.booking.repository;

import com.assetflow.modules.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

// 1. File Name: BookingRepository.java
// 2. Folder Location: assetflow-backend/src/main/java/com/assetflow/modules/booking/repository
// 3. Purpose: Repository interface for Booking entity.

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId AND b.status IN ('Upcoming', 'Active') " +
           "AND ((b.startDate = :startDate AND b.startTime < :endTime AND b.endTime > :startTime) OR " +
           "(b.startDate < :endDate AND b.endDate > :startDate))")
    List<Booking> findOverlappingBookings(@Param("resourceId") Long resourceId,
                                          @Param("startDate") LocalDate startDate,
                                          @Param("startTime") LocalTime startTime,
                                          @Param("endDate") LocalDate endDate,
                                          @Param("endTime") LocalTime endTime);
}
