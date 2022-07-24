package com.antonl.cssundays.services.model

import com.antonl.cssundays.model.InvitationStatus
import com.antonl.cssundays.model.InviteToTeam
import com.antonl.cssundays.model.Team
import com.antonl.cssundays.model.User
import com.antonl.cssundays.repositories.InviteToTeamRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class InviteToTeamService(val inviteToTeamRepository: InviteToTeamRepository, val teamService: TeamService, val userService: UserService) {
    fun saveInviteToTeam(inviteToTeam: InviteToTeam): InviteToTeam {
        return inviteToTeamRepository.save(inviteToTeam)
    }

    fun findInviteToTeamById(id: Int): InviteToTeam? {
        return inviteToTeamRepository.findInviteToTeamById(id);
    }

    fun findInviteToTeamsByPlayerAndStatus(player: User, status: InvitationStatus): List<InviteToTeam> {
        return inviteToTeamRepository.findInviteToTeamsByPlayerAndStatus(player, status);
    }

    fun createInviteToTeam(player: User, team: Team): InviteToTeam {
        val inviteToTeam = InviteToTeam(team = team, player = player)
        return saveInviteToTeam(inviteToTeam);
    }

    fun acceptInvite(inviteToTeam: InviteToTeam): InviteToTeam {
        teamService.addPlayerToTeam(inviteToTeam.player, inviteToTeam.team)
        inviteToTeam.status = InvitationStatus.ACCEPTED;
        teamService.saveTeam(inviteToTeam.team)
        userService.saveUser(inviteToTeam.player)
        return saveInviteToTeam(inviteToTeam);
    }

    fun declineInvite(inviteToTeam: InviteToTeam): InviteToTeam {
        inviteToTeam.status = InvitationStatus.DECLINED;
        return saveInviteToTeam(inviteToTeam);
    }
}