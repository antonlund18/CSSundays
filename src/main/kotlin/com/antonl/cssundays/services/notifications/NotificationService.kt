package com.antonl.cssundays.services.notifications

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.NotifiableObject
import com.antonl.cssundays.model.notifications.Notification
import com.antonl.cssundays.model.notifications.NotificationAction
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import com.antonl.cssundays.repositories.NotificationRepository
import com.antonl.cssundays.services.model.InviteToTeamService
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class NotificationService(
    val notificationRepository: NotificationRepository,
    val inviteToTeamService: InviteToTeamService
) {
    fun saveNotification(notification: Notification): Notification {
        return notificationRepository.save(notification);
    }

    fun createNotification(id: Int? = 1, recipient: User, notifiableObject: NotifiableObject? = null): Notification {
        val notification = Notification(id, recipient, notifiableObject);
        return saveNotification(notification)
    }

    fun getUnseenNotifications(user: User): List<Notification> {
        return notificationRepository.findNotificationsByUserAndSeen(user, false)
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

    fun createNotificationInviteToTeamSend(id: Int = 1, recipient: User, sender: User, team: Team): Notification {
        val inviteToTeam = inviteToTeamService.createInviteToTeam(recipient = recipient, sender = sender, team = team);
        val notification = Notification(id, recipient, inviteToTeam);
        return saveNotification(notification);
    }

    fun handleNotificationAction(notification: Notification, notificationAction: NotificationAction) {
        val notifiableObject = notification.notifiableObject
        when (notificationAction) {
            NotificationAction.ACCEPT_TEAM_INVITATION ->
                if (notifiableObject is InviteToTeam) inviteToTeamService.acceptInvite(notifiableObject)
            NotificationAction.DECLINE_TEAM_INVITATION ->
                if (notifiableObject is InviteToTeam) inviteToTeamService.declineInvite(notifiableObject)
        }
    }
}