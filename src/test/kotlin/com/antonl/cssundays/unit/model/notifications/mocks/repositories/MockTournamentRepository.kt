package com.antonl.cssundays.unit.model.notifications.mocks.repositories

import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.repositories.TournamentRepository
import java.util.*

class MockTournamentRepository : TournamentRepository {
    override fun findById(id: Int): Tournament? {
        TODO("Not yet implemented")
    }

    override fun findById(id: String): Optional<Tournament> {
        TODO("Not yet implemented")
    }

    override fun findTournamentByName(name: String): Tournament? {
        TODO("Not yet implemented")
    }

    override fun findTournamentsByName(name: String): List<Tournament> {
        TODO("Not yet implemented")
    }

    override fun findTournamentByBracketRoot(matchId: Int): Tournament? {
        TODO("Not yet implemented")
    }

    override fun <S : Tournament?> save(entity: S): S {
        return entity
    }

    override fun <S : Tournament?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
        TODO("Not yet implemented")
    }

    override fun existsById(id: String): Boolean {
        TODO("Not yet implemented")
    }

    override fun findAll(): MutableIterable<Tournament> {
        TODO("Not yet implemented")
    }

    override fun findAllById(ids: MutableIterable<String>): MutableIterable<Tournament> {
        TODO("Not yet implemented")
    }

    override fun count(): Long {
        TODO("Not yet implemented")
    }

    override fun deleteById(id: String) {
        TODO("Not yet implemented")
    }

    override fun delete(entity: Tournament) {
        TODO("Not yet implemented")
    }

    override fun deleteAllById(ids: MutableIterable<String>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll(entities: MutableIterable<Tournament>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll() {
        TODO("Not yet implemented")
    }
}