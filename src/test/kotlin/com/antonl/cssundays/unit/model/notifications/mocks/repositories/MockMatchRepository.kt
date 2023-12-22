package com.antonl.cssundays.unit.model.notifications.mocks.repositories

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.repositories.MatchRepository
import java.util.*

class MockMatchRepository : MatchRepository {
    override fun findById(id: Int): Match? {
        TODO("Not yet implemented")
    }

    override fun findById(id: String): Optional<Match> {
        TODO("Not yet implemented")
    }

    override fun findByParentIdIn(ids: List<Int>): List<Match> {
        TODO("Not yet implemented")
    }

    override fun <S : Match?> save(entity: S): S {
        return entity
    }

    override fun <S : Match?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
        TODO("Not yet implemented")
    }

    override fun existsById(id: String): Boolean {
        TODO("Not yet implemented")
    }

    override fun findAll(): MutableIterable<Match> {
        TODO("Not yet implemented")
    }

    override fun findAllById(ids: MutableIterable<String>): MutableIterable<Match> {
        TODO("Not yet implemented")
    }

    override fun count(): Long {
        TODO("Not yet implemented")
    }

    override fun deleteById(id: String) {
        TODO("Not yet implemented")
    }

    override fun delete(entity: Match) {
        TODO("Not yet implemented")
    }

    override fun deleteAllById(ids: MutableIterable<String>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll(entities: MutableIterable<Match>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll() {
        TODO("Not yet implemented")
    }
}