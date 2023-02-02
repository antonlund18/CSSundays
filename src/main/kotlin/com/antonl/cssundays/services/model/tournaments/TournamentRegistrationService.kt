package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.core.Team
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
        return tournament.teamRegistrations.map { it.team }
    }

    fun createTournamentRegistration(tournament: Tournament, team: Team): TournamentRegistration {
        val tournamentRegistration = TournamentRegistration(tournament = tournament, team = team)
        return saveTournamentRegistration(tournamentRegistration)
    }
}