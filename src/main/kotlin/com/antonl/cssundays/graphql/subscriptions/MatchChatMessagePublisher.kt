package com.antonl.cssundays.graphql.subscriptions

import com.antonl.cssundays.model.tournaments.brackets.matches.MatchChatMessage
import org.reactivestreams.Publisher
import org.springframework.stereotype.Component
import reactor.core.publisher.Sinks

@Component
class MatchChatMessagePublisher {
    companion object {
        private val processor = Sinks.many().multicast().directBestEffort<MatchChatMessage>()

        fun publish(chatMessage: MatchChatMessage) {
            processor.tryEmitNext(chatMessage)
        }

        fun getPublisher(matchId: Int): Publisher<MatchChatMessage> {
            return processor.asFlux().filter { it.match.id == matchId }
        }
    }
}