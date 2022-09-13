package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.Notification
import org.springframework.data.repository.CrudRepository

interface NotificationRepository : CrudRepository<Notification, Int> {
    fun findNotificationsByRecipientAndIsSeen(recipient: User, isSeen: Boolean): List<Notification>
    fun findNotificationById(id: Int): Notification?
}