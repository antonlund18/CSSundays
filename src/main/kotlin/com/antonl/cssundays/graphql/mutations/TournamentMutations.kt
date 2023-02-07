package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.graphql.server.directives.AuthorizationDirective
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.core.UserRole
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class TournamentMutations : Mutation {
    @Autowired
    private lateinit var tournamentService: TournamentService

    @Autowired
    private lateinit var teamService: TeamService

    @Autowired
    private lateinit var userService: UserService

//    @AuthorizationDirective([UserRole.ADMIN, UserRole.ORGANIZER])
    suspend fun createTournament(name: String, date: String, numberOfTeamsAllowed: Int): Tournament? {
        return tournamentService.createTournament(name, date, numberOfTeamsAllowed)
    }

//    @AuthorizationDirective([UserRole.ADMIN, UserRole.ORGANIZER])
    suspend fun generateBracket(tournamentId: Int): Tournament? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        return tournamentService.generateBracket(tournament)
    }

    suspend fun registerTeam(tournamentId: Int, teamId: Int): Tournament? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        val team = teamService.createTeam(System.currentTimeMillis().toString(), userService.findUserById(7) ?: return null)
        return tournamentService.registerTeam(team, tournament)
    }
}