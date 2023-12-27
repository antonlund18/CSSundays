package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.graphql.server.directives.AuthorizationDirective
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.core.UserRole
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.tournaments.SharedTournamentAndTournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class SharedTournamentAndTournamentRegistrationMutations : Mutation {
    @Autowired
    private lateinit var sharedTournamentAndTournamentRegistrationService: SharedTournamentAndTournamentRegistrationService

    @Autowired
    private lateinit var tournamentService: TournamentService

    @Autowired
    private lateinit var teamService: TeamService

    @Autowired
    private lateinit var userService: UserService

    suspend fun registerTeam(tournamentId: Int, teamId: Int, captainId: Int): Tournament? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        val captain = userService.findUserById(captainId) ?: return null
        val team = teamService.findTeamById(teamId) ?: return null
        sharedTournamentAndTournamentRegistrationService.createTournamentRegistration(tournament, team, captain)
        return tournament
    }
}