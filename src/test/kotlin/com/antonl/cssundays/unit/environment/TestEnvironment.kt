package com.antonl.cssundays.unit.environment

import com.antonl.cssundays.services.model.notifications.InviteToTeamService
import com.antonl.cssundays.services.model.core.SharedTeamAndUserService
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.notifications.NotificationService
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.services.model.tournaments.SharedTournamentAndTournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.antonl.cssundays.unit.model.notifications.mocks.repositories.*

class TestEnvironment {
    private val userRepository = MockUserRepository()
    private val teamRepository = MockTeamRepository()
    private val notificationRepository = MockNotificationRepository()
    private val inviteToTeamRepository = MockInviteToTeamRepository()
    private val tournamentRepository = MockTournamentRepository()
    private val tournamentRegistrationRepository = MockTournamentRegistrationRepository()
    private val matchRepository = MockMatchRepository()

    val userService = UserService(userRepository)
    val teamService = TeamService(teamRepository)
    val matchService = MatchService(matchRepository)
    val sharedTeamAndUserService = SharedTeamAndUserService(userRepository, teamRepository)
    val notificationService = NotificationService(notificationRepository)
    val inviteToTeamService = InviteToTeamService(inviteToTeamRepository, sharedTeamAndUserService, notificationService)
    val sharedTournamentAndTournamentRegistrationService = SharedTournamentAndTournamentRegistrationService(tournamentRepository, tournamentRegistrationRepository)
    val tournamentRegistrationService = TournamentRegistrationService(tournamentRegistrationRepository)
    val tournamentService = TournamentService(tournamentRepository, tournamentRegistrationService, matchService)
}