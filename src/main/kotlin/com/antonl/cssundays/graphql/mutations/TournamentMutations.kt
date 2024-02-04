package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.tournaments.TournamentFormat
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.tournaments.SharedTournamentAndTournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import javax.transaction.Transactional

@Component
@Transactional
class TournamentMutations : Mutation {
    @Autowired
    private lateinit var tournamentService: TournamentService

    @Autowired
    private lateinit var teamService: TeamService

    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var sharedTournamentAndTournamentRegistrationService: SharedTournamentAndTournamentRegistrationService

//    @AuthorizationDirective([UserRole.ADMIN, UserRole.ORGANIZER])
    suspend fun createTournament(name: String, date: LocalDateTime, numberOfTeamsAllowed: Int, format: TournamentFormat, picture: String?, description: String, rules: String): Tournament? {
        val tournament = tournamentService.createTournament(name, date, numberOfTeamsAllowed, format, picture, description, rules)
        return tournament
    }

    suspend fun publishTournament(tournamentId: Int): Tournament? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        return tournamentService.publishTournament(tournament)
    }

    suspend fun removePublicationFromTournament(tournamentId: Int): Tournament? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        return tournamentService.removePublication(tournament)
    }

//    @AuthorizationDirective([UserRole.ADMIN, UserRole.ORGANIZER])
    suspend fun generateBracket(tournamentId: Int): Tournament? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        return tournamentService.generateBracket(tournament)
    }

    suspend fun startTournament(tournamentId: Int): Tournament? {
        val tournament = tournamentService.getTournamentById(tournamentId) ?: return null
        return tournamentService.startTournament(tournament)
    }
}