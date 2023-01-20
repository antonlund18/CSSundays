package com.antonl.cssundays.services.model.notifications

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.NotifiableObject
import com.antonl.cssundays.model.notifications.Notification
import com.antonl.cssundays.model.notifications.NotificationAction
import com.antonl.cssundays.model.notifications.NotificationType
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import com.antonl.cssundays.repositories.NotificationRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class NotificationService(val notificationRepository: NotificationRepository){
    fun saveNotification(notification: Notification): Notification {
        return notificationRepository.save(notification);
    }

    fun createNotification(
        recipient: User,
        notificationType: NotificationType,
        notifiableObject: NotifiableObject? = null
    ): Notification {
        val notification = Notification(recipient = recipient, notificationType = notificationType, notifiableObject = notifiableObject);
        return saveNotification(notification)
    }

    fun getUnseenNotifications(user: User): List<Notification> {
        return notificationRepository.findNotificationsByRecipientAndIsSeen(user, false)
    }

    fun getAllNotifications(user: User): List<Notification> {
        return notificationRepository.findAllByRecipient(user)
    }

    fun viewAllNotifications(user: User) {
        val unseenNotifications: List<Notification> = getUnseenNotifications(user);
        unseenNotifications.forEach { notification ->
            run {
                notification.isSeen = true;
                saveNotification(notification);
            }
        }
    }

}