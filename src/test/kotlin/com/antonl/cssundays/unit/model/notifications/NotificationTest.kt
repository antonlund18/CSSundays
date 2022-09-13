package com.antonl.cssundays.unit.model.notifications

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.NotifiableObject
import com.antonl.cssundays.model.notifications.NotificationAction
import com.antonl.cssundays.model.notifications.notificationobjects.InvitationStatus
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import com.antonl.cssundays.services.notifications.NotificationService
import com.antonl.cssundays.unit.environment.TestEnvironment
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class NotificationTest {
    private lateinit var testEnvironment: TestEnvironment
    private lateinit var notificationService: NotificationService
    private lateinit var sender: User
    private lateinit var recipient: User
    private lateinit var team: Team
    private lateinit var notifiableObject: NotifiableObject

    @BeforeEach
    fun setUp() {
        testEnvironment = TestEnvironment()
        notificationService = testEnvironment.notificationService
        sender = testEnvironment.userService.createUser("Anton", "anton@anton.anton", "anton12345")
        recipient = testEnvironment.userService.createUser("Anders", "anders@anders.anders", "anders12345")
        team = testEnvironment.teamService.createTeam("Anton's hold", sender)
        notifiableObject = InviteToTeam(-1, recipient, sender, team)
    }

    @Test
    fun userShouldHaveOneUnseenNotification() {
        val notification1 = notificationService.createNotification(1, sender, notifiableObject)

        val unseenNotifications = notificationService.getUnseenNotifications(sender)
        assertEquals(1, unseenNotifications.size)
        assertEquals(notification1, unseenNotifications[0])
    }

    @Test
    fun userShouldNotHaveAnyUnseenNotificationsAfterViewingThem() {
        notificationService.createNotification(1, sender, notifiableObject)
        notificationService.createNotification(2, sender, notifiableObject)

        var unseenNotifications = notificationService.getUnseenNotifications(sender)
        assertEquals(2, unseenNotifications.size)

        notificationService.viewAllNotifications(sender)
        unseenNotifications = notificationService.getUnseenNotifications(sender)
        assertEquals(0, unseenNotifications.size)
    }

    @Test
    fun invitationIsAcceptedFromNotification() {
        val notification1 = notificationService.createNotification(1, sender, notifiableObject)
        val notifiableObject = notification1.notifiableObject

        assertTrue(notifiableObject is InviteToTeam)
        assertEquals(InvitationStatus.PENDING, (notifiableObject as InviteToTeam).status)

        notificationService.handleNotificationAction(notification1, NotificationAction.ACCEPT_TEAM_INVITATION)
        assertEquals(InvitationStatus.ACCEPTED, notifiableObject.status)
        assertEquals(1, recipient.teams.size)
        assertEquals(team, recipient.teams[0])
    }
}