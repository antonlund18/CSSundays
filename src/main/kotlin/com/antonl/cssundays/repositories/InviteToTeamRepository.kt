package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.notificationobjects.InvitationStatus
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import org.springframework.data.repository.CrudRepository

interface InviteToTeamRepository : CrudRepository<InviteToTeam, Int> {
    fun findInviteToTeamsByRecipient(recipient: User): List<InviteToTeam>
    fun findInviteToTeamsByRecipientAndStatus(recipient: User, status: InvitationStatus): List<InviteToTeam>
    fun findInviteToTeamById(id: Int): InviteToTeam?
}