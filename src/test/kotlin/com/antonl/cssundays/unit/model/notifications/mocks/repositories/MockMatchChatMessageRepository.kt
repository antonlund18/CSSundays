package com.antonl.cssundays.unit.model.notifications.mocks.repositories

import com.antonl.cssundays.model.tournaments.brackets.matches.MatchChatMessage
import com.antonl.cssundays.repositories.MatchChatMessageRepository
import java.util.*

class MockMatchChatMessageRepository : MatchChatMessageRepository {
    override fun <S : MatchChatMessage?> save(entity: S): S {
        TODO("Not yet implemented")
    }

    override fun <S : MatchChatMessage?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
        TODO("Not yet implemented")
    }

    override fun findAll(): MutableIterable<MatchChatMessage> {
        TODO("Not yet implemented")
    }

    override fun findAllById(ids: MutableIterable<Int>): MutableIterable<MatchChatMessage> {
        TODO("Not yet implemented")
    }

    override fun count(): Long {
        TODO("Not yet implemented")
    }

    override fun delete(entity: MatchChatMessage) {
        TODO("Not yet implemented")
    }

    override fun deleteAllById(ids: MutableIterable<Int>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll(entities: MutableIterable<MatchChatMessage>) {
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

    override fun findById(id: Int): Optional<MatchChatMessage> {
        TODO("Not yet implemented")
    }
}