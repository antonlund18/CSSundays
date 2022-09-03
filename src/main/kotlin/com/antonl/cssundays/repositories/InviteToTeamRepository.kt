package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.InvitationStatus
import com.antonl.cssundays.model.InviteToTeam
import com.antonl.cssundays.model.User
import org.springframework.data.repository.CrudRepository

interface InviteToTeamRepository : CrudRepository<InviteToTeam, Int> {
    fun findInviteToTeamsByPlayer(player: User): List<InviteToTeam>
    fun findInviteToTeamsByPlayerAndStatus(player: User, status: InvitationStatus): List<InviteToTeam>
    fun findInviteToTeamById(id: Int): InviteToTeam?
    fun findInviteToTeamByPlayerAndSeen(player: User, seen: Boolean): List<InviteToTeam>
}