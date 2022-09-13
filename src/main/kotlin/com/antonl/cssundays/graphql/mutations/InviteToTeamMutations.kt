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

//    suspend fun createInviteToTeam(playerId: Int, teamId: Int, senderId: Int): InviteToTeam? {
//        val player = userService.findUserById(playerId) ?: return null;
//        val sender = userService.findUserById(senderId) ?: return null;
//        val team = teamService.findTeamById(teamId) ?: return null;
//        return inviteToTeamService.createInviteToTeam(player, team, sender);
//    }
//
//    suspend fun acceptInvitation(invitationId: Int): InviteToTeam? {
//        val inviteToTeam = inviteToTeamService.findInviteToTeamById(invitationId) ?: return null;
//        return inviteToTeamService.acceptInvite(inviteToTeam);
//    }

    suspend fun declineInvitation(invitationId: Int): InviteToTeam? {
        val inviteToTeam = inviteToTeamService.findInviteToTeamById(invitationId) ?: return null;
        return inviteToTeamService.declineInvite(inviteToTeam);
    }

//    suspend fun markInvitationsAsSeen(playerId: Int): List<InviteToTeam> {
//        val player = userService.findUserById(playerId) ?: return listOf();
//        val invites = inviteToTeamService.findAllUnseenInviteToTeamsByPlayer(player)
//        val updatedInvites = invites.map {
//            inviteToTeamService.markAsSeen(it);
//        }
//        return updatedInvites;
//    }
}