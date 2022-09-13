package com.antonl.cssundays.unit.model.notifications.mocks.repositories

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.notificationobjects.InvitationStatus
import com.antonl.cssundays.model.notifications.notificationobjects.InviteToTeam
import com.antonl.cssundays.repositories.InviteToTeamRepository
import java.util.*

class MockInviteToTeamRepository(var invitesToTeams: MutableList<InviteToTeam> = mutableListOf()) : InviteToTeamRepository {
    override fun findInviteToTeamsByPlayer(player: User): List<InviteToTeam> {
        TODO("Not yet implemented")
    }

    override fun findInviteToTeamsByRecipientAndStatus(player: User, status: InvitationStatus): List<InviteToTeam> {
        TODO("Not yet implemented")
    }

    override fun findInviteToTeamById(id: Int): InviteToTeam? {
        TODO("Not yet implemented")
    }

    override fun <S : InviteToTeam> save(entity: S): S {
        if (!invitesToTeams.contains(entity)) {
            invitesToTeams.add(entity)
        }
        return entity
    }

    override fun <S : InviteToTeam?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
        TODO("Not yet implemented")
    }

    override fun findAll(): MutableIterable<InviteToTeam> {
        TODO("Not yet implemented")
    }

    override fun findAllById(ids: MutableIterable<Int>): MutableIterable<InviteToTeam> {
        TODO("Not yet implemented")
    }

    override fun count(): Long {
        TODO("Not yet implemented")
    }

    override fun delete(entity: InviteToTeam) {
        TODO("Not yet implemented")
    }

    override fun deleteAllById(ids: MutableIterable<Int>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll(entities: MutableIterable<InviteToTeam>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll() {
        TODO("Not yet implemented")
    }

    override fun deleteById(id: Int) {
        TODO("Not yet implemented")
    }

    override fun existsById(id: Int): Boolean {
        TODO("Not yet implemented")
    }

    override fun findById(id: Int): Optional<InviteToTeam> {
        TODO("Not yet implemented")
    }

}
