package com.antonl.cssundays.repositories

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import org.springframework.data.repository.CrudRepository

interface TournamentRegistrationRepository : CrudRepository<TournamentRegistration, String> {
    fun findById(id: Int): TournamentRegistration?
    fun findByTournamentAndPlayers(tournament: Tournament, player: User): TournamentRegistration?
    fun findByTournamentAndTeam(tournament: Tournament, team: Team): TournamentRegistration?
}