package com.antonl.cssundays.graphql.subscriptions

import com.antonl.cssundays.model.notifications.Notification
import org.reactivestreams.Publisher
import org.springframework.stereotype.Component
import reactor.core.publisher.Sinks

@Component
class NotificationPublisher {
    companion object {
        private val processor = Sinks.many().multicast().directBestEffort<Notification>()

        fun publish(notification: Notification) {
            processor.tryEmitNext(notification)
        }

        fun getPublisher(userId: Int): Publisher<Notification> {
            return processor.asFlux().filter { it.recipient.id == userId }
        }
    }
}
