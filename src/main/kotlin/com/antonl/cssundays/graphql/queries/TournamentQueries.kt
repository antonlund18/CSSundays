package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.core.Tournament
import com.antonl.cssundays.services.model.core.TournamentService
import com.expediagroup.graphql.server.operations.Query
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class TournamentQueries : Query {
    @Autowired
    private lateinit var tournamentService: TournamentService

    suspend fun getAllTournaments(): List<Tournament> {
        return tournamentService.getAllTournaments()
    }
}