package com.antonl.cssundays.unit.model.notifications.mocks.repositories

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.Notification
import com.antonl.cssundays.repositories.NotificationRepository
import java.util.*

class MockNotificationRepository(var notifications: MutableList<Notification> = mutableListOf()) : NotificationRepository {
    override fun findNotificationsByRecipientAndIsSeen(recipient: User, isSeen: Boolean): List<Notification> {
        return notifications
            .stream()
            .filter { notification -> notification.recipient.equals(recipient) && notification.isSeen.equals(isSeen) }
            .toList()
    }

    override fun findNotificationById(id: Int): Notification? {
        return notifications.find { notification -> notification.id?.equals(id) ?: false }
    }

    override fun findNotificationsById(ids: List<Int>): List<Notification> {
        return notifications.filter { notification -> ids.contains(notification.id) }
    }

    override fun findAllByRecipient(recipient: User): List<Notification> {
        TODO("Not yet implemented")
    }

    override fun <S : Notification> save(entity: S): S {
        if (!notifications.contains(entity)) {
            notifications.add(entity);
        }
        return entity
    }

    override fun <S : Notification?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
        return entities
    }

    override fun findAll(): MutableIterable<Notification> {
        return notifications;
    }

    override fun findAllById(ids: MutableIterable<Int>): MutableIterable<Notification> {
        TODO("Not yet implemented")
    }

    override fun count(): Long {
        TODO("Not yet implemented")
    }

    override fun delete(entity: Notification) {
        notifications.remove(entity)
    }

    override fun deleteAllById(ids: MutableIterable<Int>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll(entities: MutableIterable<Notification>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll() {
        notifications.clear()
    }

    override fun deleteById(id: Int) {
        TODO("Not yet implemented")
    }

    override fun existsById(id: Int): Boolean {
        TODO("Not yet implemented")
    }

    override fun findById(id: Int): Optional<Notification> {
        TODO("Not yet implemented")
    }
}