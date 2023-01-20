package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import com.antonl.cssundays.services.model.notifications.InviteToTeamService
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class InviteToTeamMutations : Mutation {
    @Autowired
    private lateinit var userService: UserService;

    @Autowired
    private lateinit var teamService: TeamService;

    @Autowired
    private lateinit var inviteToTeamService: InviteToTeamService;

    suspend fun createInviteToTeam(recipientId: Int, teamId: Int, senderId: Int): InviteToTeam? {
        val recipient = userService.findUserById(recipientId) ?: return null
        val sender = userService.findUserById(senderId) ?: return null
        val team = teamService.findTeamById(teamId) ?: return null
        return inviteToTeamService.createInviteToTeam(recipient, team, sender)
    }

    suspend fun acceptInvitation(invitationId: Int): InviteToTeam? {
        val inviteToTeam = inviteToTeamService.findInviteToTeamById(invitationId) ?: return null;
        return inviteToTeamService.acceptInvite(inviteToTeam);
    }

    suspend fun declineInvitation(invitationId: Int): InviteToTeam? {
        val inviteToTeam = inviteToTeamService.findInviteToTeamById(invitationId) ?: return null;
        return inviteToTeamService.declineInvite(inviteToTeam);
    }
}