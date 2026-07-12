package com.assetflow.modules.notification.service;

import com.assetflow.dto.ApiResponse;
import com.assetflow.modules.notification.dto.NotificationResponse;
import com.assetflow.modules.notification.entity.Notification;
import com.assetflow.modules.notification.enums.NotificationType;
import com.assetflow.modules.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for Notification operations.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationRepository notificationRepository;

    /**
     * Sends/creates a notification.
     */
    @Transactional
    public ApiResponse<NotificationResponse> sendNotification(String title, String message, Long recipientId, NotificationType type) {
        log.info("Sending notification type: {} to recipient: {}", type, recipientId);

        Notification notification = Notification.builder()
                .title(title)
                .message(message)
                .recipientId(recipientId)
                .type(type.name())
                .readStatus(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        log.info("Notification created with ID: {}", saved.getId());
        return ApiResponse.success("Notification sent successfully.", toResponse(saved));
    }

    /**
     * Retrieves all notifications for a recipient.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<NotificationResponse>> getNotificationsForRecipient(Long recipientId) {
        log.info("Fetching notifications for recipient: {}", recipientId);
        List<NotificationResponse> list = notificationRepository.findByRecipientIdOrderByCreatedDateDesc(recipientId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Notifications retrieved successfully.", list);
    }

    /**
     * Retrieves unread notifications for a recipient.
     */
    @Transactional(readOnly = true)
    public ApiResponse<List<NotificationResponse>> getUnreadNotifications(Long recipientId) {
        log.info("Fetching unread notifications for recipient: {}", recipientId);
        List<NotificationResponse> list = notificationRepository.findByRecipientIdAndReadStatusOrderByCreatedDateDesc(recipientId, false)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        return ApiResponse.success("Unread notifications retrieved successfully.", list);
    }

    /**
     * Marks a notification as read.
     */
    @Transactional
    public ApiResponse<NotificationResponse> markAsRead(Long id) {
        log.info("Marking notification ID: {} as read", id);
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ApiResponse.error("Notification not found with ID: " + id);
        }
        notification.setReadStatus(true);
        Notification saved = notificationRepository.save(notification);
        return ApiResponse.success("Notification marked as read.", toResponse(saved));
    }

    /**
     * Marks all notifications for a user as read.
     */
    @Transactional
    public ApiResponse<Void> markAllAsRead(Long recipientId) {
        log.info("Marking all notifications as read for recipient: {}", recipientId);
        List<Notification> unread = notificationRepository.findByRecipientIdAndReadStatusOrderByCreatedDateDesc(recipientId, false);
        for (Notification n : unread) {
            n.setReadStatus(true);
        }
        notificationRepository.saveAll(unread);
        return ApiResponse.success("All notifications marked as read.", null);
    }

    /**
     * Deletes a notification.
     */
    @Transactional
    public ApiResponse<Void> deleteNotification(Long id) {
        log.info("Deleting notification ID: {}", id);
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ApiResponse.error("Notification not found.");
        }
        notificationRepository.delete(notification);
        return ApiResponse.success("Notification deleted successfully.", null);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .recipientId(n.getRecipientId())
                .type(n.getType())
                .readStatus(n.getReadStatus())
                .createdDate(n.getCreatedDate())
                .build();
    }
}
