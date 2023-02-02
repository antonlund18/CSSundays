package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.tournaments.*
import com.antonl.cssundays.repositories.TournamentRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class TournamentService(
    val tournamentRepository: TournamentRepository,
    val tournamentRegistrationService: TournamentRegistrationService
) {
    fun saveTournament(tournament: Tournament): Tournament {
        return tournamentRepository.save(tournament)
    }

    fun getAllTournaments(): List<Tournament> {
        return tournamentRepository.findAll().toList()
    }

    fun createTournament(name: String, date: String, numberOfTeamsAllowed: Int): Tournament {
        val tournament = Tournament(
            name = name,
            date = date,
            numberOfTeamsAllowed = numberOfTeamsAllowed
        )
        saveTournament(tournament)
        return tournament
    }

    fun getTournamentById(id: Int): Tournament? {
        return tournamentRepository.findById(id)
    }

    fun registerTeam(team: Team, tournament: Tournament): Tournament? {
        if (tournament.teamRegistrations.size < tournament.numberOfTeamsAllowed) {
            tournamentRegistrationService.createTournamentRegistration(tournament, team)
            saveTournament(tournament)
        }
        return tournament
    }

    fun generateBracket(tournament: Tournament): Tournament {
        val bracket = createBracket(tournament).bracket ?: return tournament
        val numberOfMatches = BracketCalculator.calculateNumberOfMatchesInBracket(tournament.teamRegistrations.size)
        val registeredTeams = tournamentRegistrationService.getRegisteredTeams(tournament)

        BracketMatchInitializer(numberOfMatches).traverseTree(bracket)
        BracketTeamPopulator(registeredTeams).populateTree(bracket)
        return saveTournament(tournament)
    }

    fun createBracket(tournament: Tournament): Tournament {
        val bracket = Bracket(tournament)
        tournament.bracket = bracket
        return saveTournament(tournament)
    }
}