package com.assetflow.modules.booking.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

// 1. File Name: BookingRequest.java
// 2. Folder Location: assetflow-backend/src/main/java/com/assetflow/modules/booking/dto
// 3. Purpose: DTO for creating or updating a booking.

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    @NotBlank(message = "Booking type is required")
    private String bookingType;

    @NotNull(message = "Booked by (employee ID) is required")
    private Long bookedBy;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @NotBlank(message = "Status is required")
    private String status; // Upcoming, Active, Completed, Cancelled

    private String remarks;
}
