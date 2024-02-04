package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.graphql.server.directives.AuthorizationDirective
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.core.UserRole
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.tournaments.SharedTournamentAndTournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class SharedTournamentAndTournamentRegistrationMutations : Mutation {
    @Autowired
    private lateinit var sharedTournamentAndTournamentRegistrationService: SharedTournamentAndTournamentRegistrationService

    @Autowired
    private lateinit var tournamentRegistrationService: TournamentRegistrationService

    @Autowired
    private lateinit var tournamentService: TournamentService

    @Autowired
    private lateinit var teamService: TeamService

    @Autowired
    private lateinit var userService: UserService

    suspend fun registerTeamOrPlayer(tournamentId: Int, teamId: Int, playerId: Int): Tournament? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        val player = userService.findUserById(playerId) ?: return null
        val team = teamService.findTeamById(teamId) ?: return null
        val tournamentRegistration = tournamentRegistrationService.getTournamentRegistrationByTeam(tournament, team)

        if (tournamentRegistration == null) {
            sharedTournamentAndTournamentRegistrationService.createTournamentRegistration(tournament, team, player)
        } else {
           sharedTournamentAndTournamentRegistrationService.registerPlayer(tournamentRegistration, player)
        }

        return tournament
    }

    suspend fun deregisterTeamFromTournament(tournamentRegistrationId: Int): TournamentRegistration? {
        val tournamentRegistration = tournamentRegistrationService.getTournamentRegistrationById(tournamentRegistrationId) ?: return null
        return sharedTournamentAndTournamentRegistrationService.softDeleteTournamentRegistration(tournamentRegistration)
    }

    suspend fun deregisterPlayerFromTournament(tournamentRegistrationId: Int, playerId: Int): TournamentRegistration? {
        val tournamentRegistration = tournamentRegistrationService.getTournamentRegistrationById(tournamentRegistrationId) ?: return null
        val player = userService.findUserById(playerId) ?: return null
        return sharedTournamentAndTournamentRegistrationService.deregisterPlayerFromTournament(tournamentRegistration, player)
    }
}