package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.tournaments.Bracket
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.services.model.tournaments.TournamentService
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

    suspend fun getTournamentById(id: Int): Tournament? {
        return tournamentService.getTournamentById(id)
    }

    suspend fun getBracket(tournamentId: Int): Bracket? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        return tournament.bracket
    }
}