package com.assetflow.modules.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

// 1. File Name: BookingResponse.java
// 2. Folder Location: assetflow-backend/src/main/java/com/assetflow/modules/booking/dto
// 3. Purpose: DTO returned by Booking APIs.

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private Long resourceId;
    private String bookingType;
    private Long bookedBy;
    private Long departmentId;
    private LocalDate startDate;
    private LocalTime startTime;
    private LocalDate endDate;
    private LocalTime endTime;
    private String purpose;
    private String status;
    private String remarks;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
