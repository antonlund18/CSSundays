package com.antonl.cssundays.unit.environment

import com.antonl.cssundays.services.model.InviteToTeamService
import com.antonl.cssundays.services.model.SharedTeamAndUserService
import com.antonl.cssundays.services.model.TeamService
import com.antonl.cssundays.services.model.UserService
import com.antonl.cssundays.services.notifications.NotificationService
import com.antonl.cssundays.unit.model.notifications.mocks.repositories.MockInviteToTeamRepository
import com.antonl.cssundays.unit.model.notifications.mocks.repositories.MockNotificationRepository
import com.antonl.cssundays.unit.model.notifications.mocks.repositories.MockTeamRepository
import com.antonl.cssundays.unit.model.notifications.mocks.repositories.MockUserRepository

class TestEnvironment {
    private val userRepository = MockUserRepository()
    private val teamRepository = MockTeamRepository()
    private val notificationRepository = MockNotificationRepository()
    private val inviteToTeamRepository = MockInviteToTeamRepository()

    val userService = UserService(userRepository)
    val teamService = TeamService(teamRepository)
    val sharedTeamAndUserService = SharedTeamAndUserService(userRepository, teamRepository)
    val inviteToTeamService = InviteToTeamService(inviteToTeamRepository, sharedTeamAndUserService)
    val notificationService = NotificationService(notificationRepository, inviteToTeamService)
}