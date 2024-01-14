package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.model.tournaments.brackets.Bracket
import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.expediagroup.graphql.server.operations.Query
import org.hibernate.Hibernate
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class TournamentQueries : Query {
    @Autowired
    private lateinit var tournamentService: TournamentService

    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var teamService: TeamService

    suspend fun getAllTournaments(): List<Tournament> {
        return tournamentService.getAllTournaments()
    }

    suspend fun getTournamentById(id: Int): Tournament? {
        val tournament = tournamentService.getTournamentById(id)
        return tournament
    }

    suspend fun getBracket(tournamentId: Int): Bracket? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        return tournament.bracket
    }

    suspend fun getFirstRoundMatches(tournamentId: Int): List<Match>? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return listOf()
        return tournamentService.getFirstRoundMatches(tournament)
    }

    suspend fun getTournamentRegistrationByPlayer(tournamentId: Int, playerId: Int): TournamentRegistration? {
        val player = userService.findUserById(playerId) ?: return null
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        val tournamentRegistration = tournamentService.getTournamentRegistrationByPlayer(tournament, player)
        Hibernate.initialize(tournamentRegistration)
        return tournamentRegistration
    }

    suspend fun getTournamentRegistrationByTeam(tournamentId: Int, teamId: Int): TournamentRegistration? {
        val team = teamService.findTeamById(teamId) ?: return null
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        val tournamentRegistration = tournamentService.getTournamentRegistrationByTeam(tournament, team)
        Hibernate.initialize(tournamentRegistration)
        return tournamentRegistration
    }
}