package com.antonl.cssundays.unit.model.notifications

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeamStatus
import com.antonl.cssundays.services.model.notifications.InviteToTeamService
import com.antonl.cssundays.unit.environment.TestEnvironment
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class InviteToTeamTest {
    private lateinit var testEnvironment: TestEnvironment
    private lateinit var inviteToTeamService: InviteToTeamService
    private lateinit var recipient: User
    private lateinit var sender: User
    private lateinit var team: Team

    @BeforeEach
    fun setUp() {
        testEnvironment = TestEnvironment()
        inviteToTeamService = testEnvironment.inviteToTeamService
        recipient = testEnvironment.userService.createUser("Anton", "anton@anton.anton", "anton12345")
        sender = testEnvironment.userService.createUser("Anders", "anders@anders.anders", "anders12345")
        team = testEnvironment.teamService.createTeam("Ander's Hold", sender)
    }

    @Test
    fun inviteToTeamIsAccepted() {
        val inviteToTeam = inviteToTeamService.createInviteToTeam(recipient, team, sender)
        assertEquals(InviteToTeamStatus.PENDING, inviteToTeam.status)

        inviteToTeamService.acceptInvite(inviteToTeam)
        assertEquals(InviteToTeamStatus.ACCEPTED, inviteToTeam.status)
        assertEquals(1, recipient.teams.size)
        assertEquals(team, recipient.teams[0])
    }

    @Test
    fun inviteToTeamIsDeclined() {
        val inviteToTeam = inviteToTeamService.createInviteToTeam(recipient, team, sender)
        assertEquals(InviteToTeamStatus.PENDING, inviteToTeam.status)

        inviteToTeamService.declineInvite(inviteToTeam)
        assertEquals(InviteToTeamStatus.DECLINED, inviteToTeam.status)
        assertEquals(0, recipient.teams.size)
    }
}