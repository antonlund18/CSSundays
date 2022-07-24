package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.InviteToTeam
import com.antonl.cssundays.services.model.InviteToTeamService
import com.antonl.cssundays.services.model.TeamService
import com.antonl.cssundays.services.model.UserService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired

class InviteToTeamMutations : Mutation {
    @Autowired
    private lateinit var userService: UserService;

    @Autowired
    private lateinit var teamService: TeamService;

    @Autowired
    private lateinit var inviteToTeamService: InviteToTeamService;

    suspend fun createInviteToTeam(playerId: Int, teamId: Int): InviteToTeam? {
        val player = userService.findUserById(playerId) ?: return null;
        val team = teamService.findTeamById(teamId) ?: return null;
        return inviteToTeamService.createInviteToTeam(player, team);
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