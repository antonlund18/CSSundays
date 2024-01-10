package com.antonl.cssundays.graphql.subscriptions

import com.antonl.cssundays.model.tournaments.brackets.Match
import org.reactivestreams.Publisher
import org.springframework.stereotype.Component
import reactor.core.publisher.Sinks

@Component
class MatchPublisher {
    companion object {
        private val processor = Sinks.many().multicast().directBestEffort<Match>()

        fun publish(match: Match) {
            processor.tryEmitNext(match)
        }

        fun getPublisher(matchId: Int): Publisher<Match> {
            return processor.asFlux().filter { it.id == matchId }
        }
    }
}