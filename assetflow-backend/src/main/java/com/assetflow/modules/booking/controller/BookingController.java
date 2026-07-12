package com.assetflow.modules.booking.controller;

import com.assetflow.dto.ApiResponse;
import com.assetflow.modules.booking.dto.BookingRequest;
import com.assetflow.modules.booking.dto.BookingResponse;
import com.assetflow.modules.booking.entity.BookingHistory;
import com.assetflow.modules.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Resource Booking operations.
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private static final Logger log = LoggerFactory.getLogger(BookingController.class);

    private final BookingService bookingService;

    /**
     * Creates a new booking.
     * POST /api/bookings
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest request) {
        log.info("POST /api/bookings - Creating booking for resource ID: {}", request.getResourceId());
        ApiResponse<BookingResponse> response = bookingService.createBooking(request);
        HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : HttpStatus.CONFLICT;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Retrieves all bookings.
     * GET /api/bookings
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        log.info("GET /api/bookings - Fetching all bookings");
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    /**
     * Retrieves a single booking by ID.
     * GET /api/bookings/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        log.info("GET /api/bookings/{} - Fetching booking", id);
        ApiResponse<BookingResponse> response = bookingService.getBookingById(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Updates an existing booking.
     * PUT /api/bookings/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBooking(@PathVariable Long id, @Valid @RequestBody BookingRequest request) {
        log.info("PUT /api/bookings/{} - Updating booking", id);
        ApiResponse<BookingResponse> response = bookingService.updateBooking(id, request);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Activates an UPCOMING booking.
     * PATCH /api/bookings/{id}/activate?performedBy={employeeId}
     */
    @PatchMapping("/{id}/activate")
    public ResponseEntity<ApiResponse<BookingResponse>> activateBooking(@PathVariable Long id, @RequestParam Long performedBy) {
        log.info("PATCH /api/bookings/{}/activate - Activating booking", id);
        ApiResponse<BookingResponse> response = bookingService.activateBooking(id, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Completes an ACTIVE booking.
     * PATCH /api/bookings/{id}/complete?performedBy={employeeId}
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<BookingResponse>> completeBooking(@PathVariable Long id, @RequestParam Long performedBy) {
        log.info("PATCH /api/bookings/{}/complete - Completing booking", id);
        ApiResponse<BookingResponse> response = bookingService.completeBooking(id, performedBy);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Cancels a booking.
     * PATCH /api/bookings/{id}/cancel?performedBy={employeeId}&reason={reason}
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable Long id,
                                                                       @RequestParam Long performedBy,
                                                                       @RequestParam(required = false, defaultValue = "Cancelled by user") String reason) {
        log.info("PATCH /api/bookings/{}/cancel - Cancelling booking", id);
        ApiResponse<BookingResponse> response = bookingService.cancelBooking(id, performedBy, reason);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Retrieves the action history for a booking.
     * GET /api/bookings/{id}/history
     */
    @GetMapping("/{id}/history")
    public ResponseEntity<ApiResponse<List<BookingHistory>>> getBookingHistory(@PathVariable Long id) {
        log.info("GET /api/bookings/{}/history - Fetching history", id);
        return ResponseEntity.ok(bookingService.getBookingHistory(id));
    }

    /**
     * Deletes a booking.
     * DELETE /api/bookings/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        log.info("DELETE /api/bookings/{} - Deleting booking", id);
        ApiResponse<Void> response = bookingService.deleteBooking(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(response);
    }
}
