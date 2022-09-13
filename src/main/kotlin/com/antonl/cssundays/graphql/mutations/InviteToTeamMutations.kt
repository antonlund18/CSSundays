package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import com.antonl.cssundays.services.model.InviteToTeamService
import com.antonl.cssundays.services.model.TeamService
import com.antonl.cssundays.services.model.UserService
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

    suspend fun acceptInvitation(invitationId: Int): InviteToTeam? {
        val inviteToTeam = inviteToTeamService.findInviteToTeamById(invitationId) ?: return null;
        return inviteToTeamService.acceptInvite(inviteToTeam);
    }

    suspend fun declineInvitation(invitationId: Int): InviteToTeam? {
        val inviteToTeam = inviteToTeamService.findInviteToTeamById(invitationId) ?: return null;
        return inviteToTeamService.declineInvite(inviteToTeam);
    }
}