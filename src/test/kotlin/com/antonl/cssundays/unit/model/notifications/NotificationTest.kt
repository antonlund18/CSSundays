package com.antonl.cssundays.unit.model.notifications

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.NotifiableObject
import com.antonl.cssundays.model.notifications.NotificationAction
import com.antonl.cssundays.model.notifications.NotificationType
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeamStatus
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import com.antonl.cssundays.services.model.notifications.InviteToTeamService
import com.antonl.cssundays.services.model.notifications.NotificationService
import com.antonl.cssundays.unit.environment.TestEnvironment
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class NotificationTest {
    private lateinit var testEnvironment: TestEnvironment
    private lateinit var notificationService: NotificationService
    private lateinit var inviteToTeamService: InviteToTeamService
    private lateinit var sender: User
    private lateinit var recipient: User
    private lateinit var team: Team
    private lateinit var notifiableObject: NotifiableObject

    @BeforeEach
    fun setUp() {
        testEnvironment = TestEnvironment()
        inviteToTeamService = testEnvironment.inviteToTeamService
        notificationService = testEnvironment.notificationService
        sender = testEnvironment.userService.createUser("Anton", "anton@anton.anton", "anton12345")
        recipient = testEnvironment.userService.createUser("Anders", "anders@anders.anders", "anders12345")
        team = testEnvironment.teamService.createTeam("Anton's hold", sender)
        notifiableObject = InviteToTeam(recipient, sender, team)
    }

    @Test
    fun userShouldHaveOneUnseenNotification() {
        inviteToTeamService.createInviteToTeam(recipient, team, sender)

        val unseenNotifications = notificationService.getUnseenNotifications(recipient)
        assertEquals(1, unseenNotifications.size)
    }

    @Test
    fun userShouldNotHaveAnyUnseenNotificationsAfterViewingThem() {
        inviteToTeamService.createInviteToTeam(recipient, team, sender)
        inviteToTeamService.createInviteToTeam(recipient, team, sender)

        var unseenNotifications = notificationService.getUnseenNotifications(recipient)
        assertEquals(2, unseenNotifications.size)

        notificationService.viewAllNotifications(recipient)
        unseenNotifications = notificationService.getUnseenNotifications(recipient)
        assertEquals(0, unseenNotifications.size)
    }
}