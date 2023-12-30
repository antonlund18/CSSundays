package com.antonl.cssundays.services.model.notifications

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.NotificationType
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeamStatus
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import com.antonl.cssundays.repositories.InviteToTeamRepository
import com.antonl.cssundays.services.model.core.SharedTeamAndUserService
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class InviteToTeamService(val inviteToTeamRepository: InviteToTeamRepository,
                          val sharedTeamAndUserService: SharedTeamAndUserService,
                          val notificationService: NotificationService
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

    fun findInviteToTeamsByRecipientAndStatus(
        player: User,
        status: InviteToTeamStatus
    ): List<InviteToTeam> {
        return inviteToTeamRepository.findInviteToTeamsByRecipientAndStatus(player, status);
    }

    fun createInviteToTeam(recipient: User, team: Team, sender: User): InviteToTeam {
        val inviteToTeam = InviteToTeam(team = team, sender = sender, recipient = recipient)
        notificationService.createNotification(recipient, NotificationType.INVITE_TO_TEAM, inviteToTeam)
        return inviteToTeam
    }

    fun acceptInvite(inviteToTeam: InviteToTeam): InviteToTeam {
        sharedTeamAndUserService.addUserToTeam(inviteToTeam.recipient, inviteToTeam.team)
        inviteToTeam.status = InviteToTeamStatus.ACCEPTED;
        return saveInviteToTeam(inviteToTeam);
    }

    fun declineInvite(inviteToTeam: InviteToTeam): InviteToTeam {
        inviteToTeam.status = InviteToTeamStatus.DECLINED;
        return saveInviteToTeam(inviteToTeam);
    }
}
