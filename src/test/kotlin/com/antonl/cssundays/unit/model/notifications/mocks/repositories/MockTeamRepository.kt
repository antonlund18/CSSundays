package com.antonl.cssundays.unit.model.notifications.mocks.repositories

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.repositories.TeamRepository
import java.util.*

class MockTeamRepository() : TeamRepository {
    override fun findTeamByName(name: String): Team? {
        TODO("Not yet implemented")
    }

    override fun findTeamsByName(name: String): List<Team> {
        TODO("Not yet implemented")
    }

    override fun findTeamById(id: Int): Team {
        TODO("Not yet implemented")
    }

    override fun <S : Team?> save(entity: S): S {
        return entity
    }

    override fun <S : Team?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
        TODO("Not yet implemented")
    }

    override fun findById(id: String): Optional<Team> {
        TODO("Not yet implemented")
    }

    override fun existsById(id: String): Boolean {
        TODO("Not yet implemented")
    }

    override fun findAll(): MutableIterable<Team> {
        TODO("Not yet implemented")
    }

    override fun findAllById(ids: MutableIterable<String>): MutableIterable<Team> {
        TODO("Not yet implemented")
    }

    override fun count(): Long {
        TODO("Not yet implemented")
    }

    override fun deleteById(id: String) {
        TODO("Not yet implemented")
    }

    override fun delete(entity: Team) {
        TODO("Not yet implemented")
    }

    override fun deleteAllById(ids: MutableIterable<String>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll(entities: MutableIterable<Team>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll() {
        TODO("Not yet implemented")
    }

}
