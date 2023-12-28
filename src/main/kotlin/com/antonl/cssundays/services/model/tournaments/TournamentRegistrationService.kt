package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.repositories.TournamentRegistrationRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class TournamentRegistrationService(val tournamentRegistrationRepository: TournamentRegistrationRepository) {
    fun saveTournamentRegistration(tournamentRegistration: TournamentRegistration): TournamentRegistration {
        return tournamentRegistrationRepository.save(tournamentRegistration)
    }

    fun getRegisteredTeams(tournament: Tournament): List<Team> {
        return tournament.tournamentRegistrations.map { it.team }
    }

    fun getTournamentRegistrationByPlayer(tournament: Tournament, player: User): TournamentRegistration? {
        return tournamentRegistrationRepository.findByTournamentAndPlayers(tournament, player)
    }

    fun getTournamentRegistrationByTeam(tournament: Tournament, team: Team): TournamentRegistration? {
        return tournamentRegistrationRepository.findByTournamentAndTeam(tournament, team)
    }
}