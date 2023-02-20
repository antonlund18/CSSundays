package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.repositories.TournamentRegistrationRepository
import com.antonl.cssundays.repositories.TournamentRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class SharedTournamentAndTournamentRegistrationService(val tournamentRepository: TournamentRepository, val tournamentRegistrationRepository: TournamentRegistrationRepository) {
    fun createTournamentRegistration(tournament: Tournament, team: Team): TournamentRegistration {
        val registration = TournamentRegistration(tournament = tournament, team = team)
        tournament.teamRegistrations.add(registration)
        tournamentRepository.save(tournament)
        tournamentRegistrationRepository.save(registration)
        return registration
    }
}