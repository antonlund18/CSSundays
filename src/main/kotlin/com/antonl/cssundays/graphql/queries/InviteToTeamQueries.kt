package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.InvitationStatus
import com.antonl.cssundays.model.InviteToTeam
import com.antonl.cssundays.services.model.InviteToTeamService
import com.antonl.cssundays.services.model.UserService
import com.expediagroup.graphql.server.operations.Query
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class InviteToTeamQueries : Query {
    @Autowired
    private lateinit var inviteToTeamService: InviteToTeamService;

    @Autowired
    private lateinit var userService: UserService;

    suspend fun findPendingInvitesForPlayer(playerId: Int): List<InviteToTeam> {
        val user = userService.findUserById(playerId) ?: return listOf();
        return inviteToTeamService.findInviteToTeamsByPlayerAndStatus(user, InvitationStatus.PENDING)
    }

    suspend fun findAllInvitesForPlayer(playerId: Int): List<InviteToTeam> {
        val user = userService.findUserById(playerId) ?: return listOf();
        return inviteToTeamService.findAllInviteToTeamsByPlayer(user);
    }

    suspend fun findAllUnseenInvitesForPlayer(playerId: Int): List<InviteToTeam> {
        val user = userService.findUserById(playerId) ?: return listOf();
        return inviteToTeamService.findAllUnseenInviteToTeamsByPlayer(user);
    }
}