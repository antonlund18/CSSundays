package com.antonl.cssundays.graphql.subscriptions

import com.antonl.cssundays.model.notifications.Notification
import com.expediagroup.graphql.server.operations.Subscription
import org.reactivestreams.Publisher
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Component
class NotificationSubscriptions : Subscription {
    fun onNewNotification(userId: Int?): Publisher<Notification>? {
        return userId?.let { NotificationPublisher.getPublisher(it).toFlux() }
    }
}