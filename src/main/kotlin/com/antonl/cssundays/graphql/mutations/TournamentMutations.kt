package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.graphql.server.directives.AuthorizationDirective
import com.antonl.cssundays.model.core.Tournament
import com.antonl.cssundays.model.core.UserRole
import com.antonl.cssundays.services.model.core.TournamentService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class TournamentMutations : Mutation {
    @Autowired
    private lateinit var tournamentService: TournamentService

    @AuthorizationDirective([UserRole.ADMIN, UserRole.ORGANIZER])
    suspend fun createTournament(name: String, date: String, numberOfTeamsAllowed: Int): Tournament? {
        return tournamentService.createTournament(name, date, numberOfTeamsAllowed)
    }
}