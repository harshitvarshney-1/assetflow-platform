package com.assetflow.modules.notification.repository;

import com.assetflow.modules.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Notification entity.
 */
@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderByCreatedDateDesc(Long recipientId);
    List<Notification> findByRecipientIdAndReadStatusOrderByCreatedDateDesc(Long recipientId, Boolean readStatus);
    long countByRecipientIdAndReadStatus(Long recipientId, Boolean readStatus);
}
