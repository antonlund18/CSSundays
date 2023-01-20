package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.Notification
import com.antonl.cssundays.model.notifications.NotificationType
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.notifications.NotificationService
import com.expediagroup.graphql.server.operations.Mutation
import org.aspectj.weaver.ast.Not
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class NotificationMutations : Mutation {
    @Autowired
    private lateinit var notificationService: NotificationService;

    @Autowired
    private lateinit var userService: UserService;

    @Autowired
    private lateinit var teamService: TeamService;

    suspend fun createNotification(recipientId: Int, notificationType: NotificationType): Notification? {
        val recipient = userService.findUserById(recipientId) ?: return null;
        return notificationService.createNotification(recipient = recipient, notificationType = notificationType)
    }

    suspend fun markAllNotificationsAsSeenForUser(userId: Int): List<Notification> {
        val user = userService.findUserById(userId) ?: return listOf()
        val unseenNotifications = notificationService.getUnseenNotifications(user)
        notificationService.viewNotifications(unseenNotifications);
        return unseenNotifications
    }
}