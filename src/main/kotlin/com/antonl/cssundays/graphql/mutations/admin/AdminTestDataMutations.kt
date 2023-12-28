package com.antonl.cssundays.graphql.mutations.admin

import com.antonl.cssundays.model.core.UserRole
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.tournaments.SharedTournamentAndTournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.time.LocalDateTime
import java.time.Month
import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.transaction.Transactional

@Component
@Transactional
class AdminTestDataMutations : Mutation {
    @PersistenceContext
    private lateinit var entityManager: EntityManager

    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var teamService: TeamService

    @Autowired
    private lateinit var tournamentService: TournamentService

    @Autowired
    private lateinit var sharedTournamentAndTournamentRegistrationService: SharedTournamentAndTournamentRegistrationService

    suspend fun createTestData(): Tournament? {
        val user1 = userService.findUserByEmail("antonlund95@gmail.com") ?: userService.createUser("Anton", "antonlund95@gmail.com", "asdasd")
        val user2 = userService.findUserByEmail("asd@asd.asd") ?: userService.createUser("asdasd", "asd@asd.asd", "asdasd")
        val user3 = userService.findUserByEmail("s1mple@gmail.com") ?: userService.createUser("s1mple", "s1mple@gmail.com", "asdasd")
        val user4 = userService.findUserByEmail("dev1ce@gmail.com") ?: userService.createUser("dev1ce", "dev1ce@gmail.com", "asdasd")
        val user5 = userService.findUserByEmail("zywoo@gmail.com") ?: userService.createUser("zywoo", "zywoo@gmail.com", "asdasd")

        userService.changeUserRole(user1, UserRole.ADMIN)

        val team1 = teamService.findTeamByName("Vinderholdet") ?: teamService.createTeam("Vinderholdet", user1)
        val team2 = teamService.findTeamByName("Taberholdet") ?: teamService.createTeam("Taberholdet", user2)
        val team3 = teamService.findTeamByName("Testholdet") ?: teamService.createTeam("Testholdet", user3)

        teamService.addPlayerToTeam(user2, team1)
        teamService.addPlayerToTeam(user3, team1)
        teamService.addPlayerToTeam(user4, team1)
        teamService.addPlayerToTeam(user5, team1)

        teamService.addPlayerToTeam(user1, team2)

        entityManager.flush()

        val tournament = tournamentService.createTournament("1.500 DKK - CSSundays #1", LocalDateTime.of(2024, Month.APRIL, 6, 12, 0), 64)
        val tournamentRegistration1 = sharedTournamentAndTournamentRegistrationService.createTournamentRegistration(tournament, team1, user1)
        val tournamentRegistration2 = sharedTournamentAndTournamentRegistrationService.createTournamentRegistration(tournament, team2, user2)
        val tournamentRegistration3 = sharedTournamentAndTournamentRegistrationService.createTournamentRegistration(tournament, team3, user3)

        sharedTournamentAndTournamentRegistrationService.registerPlayer(tournamentRegistration1, user4)
        sharedTournamentAndTournamentRegistrationService.registerPlayer(tournamentRegistration2, user5)

        tournamentService.generateBracket(tournament)
        return tournament
    }
}