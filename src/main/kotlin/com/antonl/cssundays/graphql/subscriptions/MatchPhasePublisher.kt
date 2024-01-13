package com.antonl.cssundays.graphql.subscriptions

import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import org.reactivestreams.Publisher
import org.springframework.stereotype.Component
import reactor.core.publisher.Sinks

@Component
class MatchPhasePublisher {
    companion object {
        private val processor = Sinks.many().multicast().directBestEffort<MatchPhase>()

        fun publish(matchPhase: MatchPhase) {
            processor.tryEmitNext(matchPhase)
        }

        fun getPublisher(matchId: Int): Publisher<MatchPhase> {
            return processor.asFlux().filter { it.match?.id == matchId }
        }
    }
}