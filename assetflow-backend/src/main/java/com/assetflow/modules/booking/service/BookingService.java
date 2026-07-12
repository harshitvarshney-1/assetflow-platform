package com.assetflow.modules.booking.service;

import com.assetflow.dto.ApiResponse;
import com.assetflow.modules.booking.dto.BookingRequest;
import com.assetflow.modules.booking.dto.BookingResponse;
import com.assetflow.modules.booking.entity.Booking;
import com.assetflow.modules.booking.entity.BookingHistory;
import com.assetflow.modules.booking.enums.BookingStatus;
import com.assetflow.modules.booking.repository.BookingHistoryRepository;
import com.assetflow.modules.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Resource Booking operations.
 * Handles CRUD, overlap detection, status transitions, and history logging.
 */
@Service
@RequiredArgsConstructor
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    private final BookingRepository bookingRepository;
    private final BookingHistoryRepository bookingHistoryRepository;

    /**
     * Creates a new booking after validating for time-slot overlaps.
     */
    @Transactional
    public ApiResponse<BookingResponse> createBooking(BookingRequest request) {
        log.info("Creating booking for resource ID: {} by employee ID: {}", request.getResourceId(), request.getBookedBy());

        List<Booking> overlapping = bookingRepository.findOverlappingBookings(
                request.getResourceId(),
                request.getStartDate(),
                request.getStartTime(),
                request.getEndDate(),
                request.getEndTime()
        );

        if (!overlapping.isEmpty()) {
            log.warn("Booking conflict detected for resource ID: {} between {} and {}", request.getResourceId(), request.getStartDate(), request.getEndDate());
            return ApiResponse.error("Booking conflict: the requested time slot overlaps with an existing booking.");
        }

        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .bookingType(request.getBookingType())
                .bookedBy(request.getBookedBy())
                .departmentId(request.getDepartmentId())
                .startDate(request.getStartDate())
                .startTime(request.getStartTime())
                .endDate(request.getEndDate())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .status(BookingStatus.UPCOMING.name())
                .remarks(request.getRemarks())
                .build();

        Booking saved = bookingRepository.save(booking);
        logHistory(saved, "CREATED", request.getBookedBy(), "Booking created");
        log.info("Booking created successfully with ID: {}", saved.getId());

        return ApiResponse.success("Booking created successfully.", toResponse(saved));
    }

    /**
     * Retrieves all bookings.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<BookingResponse>> getAllBookings() {
        log.info("Fetching all bookings");
        List<BookingResponse> bookings = bookingRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        log.info("Retrieved {} bookings", bookings.size());
        return ApiResponse.success("Bookings retrieved successfully.", bookings);
    }

    /**
     * Retrieves a single booking by ID.
     */
    @Transactional(readOnly = true)
    public ApiResponse<BookingResponse> getBookingById(Long id) {
        log.info("Fetching booking with ID: {}", id);
        Booking booking = bookingRepository.findById(id)
                .orElse(null);

        if (booking == null) {
            log.warn("Booking not found with ID: {}", id);
            return ApiResponse.error("Booking not found with ID: " + id);
        }

        return ApiResponse.success("Booking retrieved successfully.", toResponse(booking));
    }

    /**
     * Updates an existing booking.
     */
    @Transactional
    public ApiResponse<BookingResponse> updateBooking(Long id, BookingRequest request) {
        log.info("Updating booking with ID: {}", id);
        Booking booking = bookingRepository.findById(id)
                .orElse(null);

        if (booking == null) {
            log.warn("Booking not found with ID: {}", id);
            return ApiResponse.error("Booking not found with ID: " + id);
        }

        if (BookingStatus.COMPLETED.name().equals(booking.getStatus()) || BookingStatus.CANCELLED.name().equals(booking.getStatus())) {
            log.warn("Cannot update booking ID: {} in status: {}", id, booking.getStatus());
            return ApiResponse.error("Cannot update a booking that is " + booking.getStatus().toLowerCase() + ".");
        }

        booking.setResourceId(request.getResourceId());
        booking.setBookingType(request.getBookingType());
        booking.setBookedBy(request.getBookedBy());
        booking.setDepartmentId(request.getDepartmentId());
        booking.setStartDate(request.getStartDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndDate(request.getEndDate());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setRemarks(request.getRemarks());

        Booking saved = bookingRepository.save(booking);
        logHistory(saved, "UPDATED", request.getBookedBy(), "Booking updated");
        log.info("Booking updated successfully with ID: {}", saved.getId());

        return ApiResponse.success("Booking updated successfully.", toResponse(saved));
    }

    /**
     * Transitions a booking to ACTIVE status.
     */
    @Transactional
    public ApiResponse<BookingResponse> activateBooking(Long id, Long performedBy) {
        log.info("Activating booking with ID: {}", id);
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return ApiResponse.error("Booking not found with ID: " + id);
        }

        if (!BookingStatus.UPCOMING.name().equals(booking.getStatus())) {
            return ApiResponse.error("Only UPCOMING bookings can be activated. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.ACTIVE.name());
        Booking saved = bookingRepository.save(booking);
        logHistory(saved, "ACTIVATED", performedBy, "Booking activated");
        log.info("Booking ID: {} activated", id);

        return ApiResponse.success("Booking activated successfully.", toResponse(saved));
    }

    /**
     * Marks a booking as COMPLETED.
     */
    @Transactional
    public ApiResponse<BookingResponse> completeBooking(Long id, Long performedBy) {
        log.info("Completing booking with ID: {}", id);
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return ApiResponse.error("Booking not found with ID: " + id);
        }

        if (!BookingStatus.ACTIVE.name().equals(booking.getStatus())) {
            return ApiResponse.error("Only ACTIVE bookings can be completed. Current status: " + booking.getStatus());
        }

        booking.setStatus(BookingStatus.COMPLETED.name());
        Booking saved = bookingRepository.save(booking);
        logHistory(saved, "COMPLETED", performedBy, "Booking completed");
        log.info("Booking ID: {} completed", id);

        return ApiResponse.success("Booking completed successfully.", toResponse(saved));
    }

    /**
     * Cancels a booking.
     */
    @Transactional
    public ApiResponse<BookingResponse> cancelBooking(Long id, Long performedBy, String reason) {
        log.info("Cancelling booking with ID: {}", id);
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return ApiResponse.error("Booking not found with ID: " + id);
        }

        if (BookingStatus.COMPLETED.name().equals(booking.getStatus()) || BookingStatus.CANCELLED.name().equals(booking.getStatus())) {
            return ApiResponse.error("Cannot cancel a booking that is already " + booking.getStatus().toLowerCase() + ".");
        }

        booking.setStatus(BookingStatus.CANCELLED.name());
        booking.setRemarks(reason);
        Booking saved = bookingRepository.save(booking);
        logHistory(saved, "CANCELLED", performedBy, reason);
        log.info("Booking ID: {} cancelled", id);

        return ApiResponse.success("Booking cancelled successfully.", toResponse(saved));
    }

    /**
     * Retrieves the full action history of a booking.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<BookingHistory>> getBookingHistory(Long bookingId) {
        log.info("Fetching history for booking ID: {}", bookingId);
        List<BookingHistory> history = bookingHistoryRepository.findByBookingIdOrderByCreatedAtDesc(bookingId);
        return ApiResponse.success("Booking history retrieved successfully.", history);
    }

    /**
     * Deletes a booking (soft-safe: only UPCOMING or CANCELLED).
     */
    @Transactional
    public ApiResponse<Void> deleteBooking(Long id) {
        log.info("Deleting booking with ID: {}", id);
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return ApiResponse.error("Booking not found with ID: " + id);
        }

        if (BookingStatus.ACTIVE.name().equals(booking.getStatus())) {
            return ApiResponse.error("Cannot delete an ACTIVE booking. Cancel it first.");
        }

        bookingRepository.delete(booking);
        log.info("Booking ID: {} deleted", id);

        return ApiResponse.success("Booking deleted successfully.", null);
    }

    /**
     * Persists a history entry for a booking action.
     */
    private void logHistory(Booking booking, String action, Long performedBy, String remarks) {
        BookingHistory history = BookingHistory.builder()
                .booking(booking)
                .action(action)
                .performedBy(performedBy)
                .remarks(remarks)
                .build();
        bookingHistoryRepository.save(history);
    }

    /**
     * Maps a Booking entity to BookingResponse DTO.
     */
    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .resourceId(booking.getResourceId())
                .bookingType(booking.getBookingType())
                .bookedBy(booking.getBookedBy())
                .departmentId(booking.getDepartmentId())
                .startDate(booking.getStartDate())
                .startTime(booking.getStartTime())
                .endDate(booking.getEndDate())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .status(booking.getStatus())
                .remarks(booking.getRemarks())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .build();
    }
}
