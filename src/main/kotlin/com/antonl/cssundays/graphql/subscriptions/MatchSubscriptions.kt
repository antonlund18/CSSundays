package com.antonl.cssundays.graphql.subscriptions

import com.antonl.cssundays.model.tournaments.brackets.matches.MatchChatMessage
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.expediagroup.graphql.server.operations.Subscription
import org.reactivestreams.Publisher
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Component
class MatchSubscriptions : Subscription {
    fun onMatchPhaseChanged(matchId: Int): Publisher<MatchPhase> {
        return MatchPhasePublisher.getPublisher(matchId).toFlux()
    }

    fun onNewMatchChatMessage(matchId: Int): Publisher<MatchChatMessage> {
        return MatchChatMessagePublisher.getPublisher(matchId).toFlux()
    }
}