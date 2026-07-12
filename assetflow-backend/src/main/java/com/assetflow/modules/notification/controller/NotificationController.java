package com.assetflow.modules.notification.controller;

import com.assetflow.dto.ApiResponse;
import com.assetflow.modules.notification.dto.NotificationResponse;
import com.assetflow.modules.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Notifications operations.
 */
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);

    private final NotificationService notificationService;

    /**
     * Retrieves all notifications for a recipient.
     * GET /api/notifications/recipient/{recipientId}
     */
    @GetMapping("/recipient/{recipientId}")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotificationsForRecipient(@PathVariable Long recipientId) {
        log.info("GET /api/notifications/recipient/{} - Fetching all notifications", recipientId);
        return ResponseEntity.ok(notificationService.getNotificationsForRecipient(recipientId));
    }

    /**
     * Retrieves unread notifications for a recipient.
     * GET /api/notifications/recipient/{recipientId}/unread
     */
    @GetMapping("/recipient/{recipientId}/unread")
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getUnreadNotifications(@PathVariable Long recipientId) {
        log.info("GET /api/notifications/recipient/{}/unread - Fetching unread notifications", recipientId);
        return ResponseEntity.ok(notificationService.getUnreadNotifications(recipientId));
    }

    /**
     * Marks a notification as read.
     * PATCH /api/notifications/{id}/read
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationResponse>> markAsRead(@PathVariable Long id) {
        log.info("PATCH /api/notifications/{}/read - Marking notification as read", id);
        ApiResponse<NotificationResponse> response = notificationService.markAsRead(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(response);
    }

    /**
     * Marks all notifications for a recipient as read.
     * PATCH /api/notifications/recipient/{recipientId}/read-all
     */
    @PatchMapping("/recipient/{recipientId}/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@PathVariable Long recipientId) {
        log.info("PATCH /api/notifications/recipient/{}/read-all - Marking all as read", recipientId);
        return ResponseEntity.ok(notificationService.markAllAsRead(recipientId));
    }

    /**
     * Deletes a notification.
     * DELETE /api/notifications/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(@PathVariable Long id) {
        log.info("DELETE /api/notifications/{} - Deleting notification", id);
        ApiResponse<Void> response = notificationService.deleteNotification(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(response);
    }
}
