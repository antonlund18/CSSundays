package com.antonl.cssundays.unit.model.notifications.mocks.repositories

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.repositories.TournamentRegistrationRepository
import java.util.*

class MockTournamentRegistrationRepository : TournamentRegistrationRepository {

    override fun findById(id: String): Optional<TournamentRegistration> {
        TODO("Not yet implemented")
    }

    override fun findTournamentRegistrationById(id: Int): TournamentRegistration? {
        TODO("Not yet implemented")
    }

    override fun findByTournamentAndPlayers(tournament: Tournament, player: User): TournamentRegistration? {
        TODO("Not yet implemented")
    }

    override fun findByTournamentAndTeam(tournament: Tournament, team: Team): TournamentRegistration? {
        TODO("Not yet implemented")
    }

    override fun <S : TournamentRegistration?> save(entity: S): S {
        return entity
    }

    override fun <S : TournamentRegistration?> saveAll(entities: MutableIterable<S>): MutableIterable<S> {
        TODO("Not yet implemented")
    }

    override fun existsById(id: String): Boolean {
        TODO("Not yet implemented")
    }

    override fun findAll(): MutableIterable<TournamentRegistration> {
        TODO("Not yet implemented")
    }

    override fun findAllById(ids: MutableIterable<String>): MutableIterable<TournamentRegistration> {
        TODO("Not yet implemented")
    }

    override fun count(): Long {
        TODO("Not yet implemented")
    }

    override fun deleteById(id: String) {
        TODO("Not yet implemented")
    }

    override fun delete(entity: TournamentRegistration) {
        TODO("Not yet implemented")
    }

    override fun deleteAllById(ids: MutableIterable<String>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll(entities: MutableIterable<TournamentRegistration>) {
        TODO("Not yet implemented")
    }

    override fun deleteAll() {
        TODO("Not yet implemented")
    }
}