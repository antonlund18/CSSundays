package com.antonl.cssundays.graphql.subscriptions

import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.expediagroup.graphql.generator.annotations.GraphQLDescription
import com.expediagroup.graphql.server.operations.Subscription
import org.reactivestreams.Publisher
import org.springframework.stereotype.Component
import reactor.kotlin.core.publisher.toFlux

@Component
class MatchSubscriptions : Subscription {
    @GraphQLDescription("Returns a random number every second")
    fun onMatchPhaseChanged(matchId: Int): Publisher<MatchPhase> {
        return MatchPublisher.getPublisher(matchId).toFlux().map { it.currentPhase }
    }
}