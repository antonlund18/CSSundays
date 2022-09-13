package com.antonl.cssundays.services.model

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.notificationobjects.InvitationStatus
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import com.antonl.cssundays.repositories.InviteToTeamRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class InviteToTeamService(
    val inviteToTeamRepository: InviteToTeamRepository,
    val sharedTeamAndUserService: SharedTeamAndUserService,
) {
    fun saveInviteToTeam(inviteToTeam: InviteToTeam): InviteToTeam {
        return inviteToTeamRepository.save(inviteToTeam)
    }

    fun findInviteToTeamById(id: Int): InviteToTeam? {
        return inviteToTeamRepository.findInviteToTeamById(id);
    }

    fun findAllInviteToTeamsByRecipient(recipient: User): List<InviteToTeam> {
        return inviteToTeamRepository.findInviteToTeamsByRecipient(recipient);
    }

    fun findInviteToTeamsByRecipientAndStatus(player: User, status: InvitationStatus): List<InviteToTeam> {
        return inviteToTeamRepository.findInviteToTeamsByRecipientAndStatus(player, status);
    }

    fun createInviteToTeam(id: Int = -1, recipient: User, team: Team, sender: User): InviteToTeam {
        val inviteToTeam = InviteToTeam(id, team = team, sender = sender, recipient = recipient)
        return saveInviteToTeam(inviteToTeam);
    }

    fun acceptInvite(inviteToTeam: InviteToTeam): InviteToTeam {
        sharedTeamAndUserService.addUserToTeam(inviteToTeam.recipient, inviteToTeam.team)
        inviteToTeam.status = InvitationStatus.ACCEPTED;
        return saveInviteToTeam(inviteToTeam);
    }

    fun declineInvite(inviteToTeam: InviteToTeam): InviteToTeam {
        inviteToTeam.status = InvitationStatus.DECLINED;
        return saveInviteToTeam(inviteToTeam);
    }
}