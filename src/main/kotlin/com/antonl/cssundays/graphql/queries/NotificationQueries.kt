package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.notifications.Notification
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.notifications.NotificationService
import com.expediagroup.graphql.server.operations.Query
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class NotificationQueries : Query {
    @Autowired
    private lateinit var notificationService: NotificationService

    @Autowired
    private lateinit var userService: UserService

    suspend fun getUnseenNotifications(userId: Int): List<Notification> {
        val user = userService.findUserById(userId) ?: return listOf();
        return notificationService.getUnseenNotifications(user);
    }

    suspend fun getAllNotifications(userId: Int): List<Notification> {
        val user = userService.findUserById(userId) ?: return listOf();
        return notificationService.getAllNotifications(user);
    }
}