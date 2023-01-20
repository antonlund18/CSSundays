package com.antonl.cssundays.unit.environment

import com.antonl.cssundays.services.model.notifications.InviteToTeamService
import com.antonl.cssundays.services.model.core.SharedTeamAndUserService
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.notifications.NotificationService
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
    val notificationService = NotificationService(notificationRepository)
    val inviteToTeamService = InviteToTeamService(inviteToTeamRepository, sharedTeamAndUserService, notificationService)
}