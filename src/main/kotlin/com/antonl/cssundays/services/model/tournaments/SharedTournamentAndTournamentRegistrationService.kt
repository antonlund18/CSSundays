package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.repositories.TournamentRegistrationRepository
import com.antonl.cssundays.repositories.TournamentRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class SharedTournamentAndTournamentRegistrationService(val tournamentRepository: TournamentRepository, val tournamentRegistrationRepository: TournamentRegistrationRepository) {
    fun createTournamentRegistration(tournament: Tournament, team: Team, captain: User): TournamentRegistration {
        var registration = TournamentRegistration(tournament = tournament, team = team, captain = captain)
        registration = tournamentRegistrationRepository.save(registration)
        tournament.tournamentRegistrations.add(registration)
        tournamentRepository.save(tournament)
        return registration
    }

    fun deregisterPlayerFromTournament(tournament: Tournament, player: User): Tournament? {
        val registration = tournamentRegistrationRepository.findByTournamentAndPlayers(tournament, player) ?: return null
        registration.players.remove(player)
        tournamentRegistrationRepository.save(registration)
        return tournamentRepository.save(tournament)
    }

    fun deregisterTeamFromTournament(tournament: Tournament, team: Team): Tournament? {
        val registration = tournamentRegistrationRepository.findByTournamentAndTeam(tournament, team) ?: return null
        registration.players.clear()
        tournamentRegistrationRepository.delete(registration)
        return tournament
    }

    fun registerPlayer(tournamentRegistration: TournamentRegistration, player: User) {
        if (tournamentRegistration.team.users.find { it.id == player.id } == null) return
        tournamentRegistration.players.add(player)
        tournamentRegistrationRepository.save(tournamentRegistration)
    }
}