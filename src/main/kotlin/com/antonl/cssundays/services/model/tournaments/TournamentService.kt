package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.tournaments.*
import com.antonl.cssundays.model.tournaments.brackets.*
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
        val bracket = createBracket(tournament)
        val registeredTeams = tournamentRegistrationService.getRegisteredTeams(tournament)
        val numberOfMatches = calculateNumberOfMatches(registeredTeams.size)

        BracketMatchInitializer(numberOfMatches).traverseTree(bracket)
        BracketTeamPopulator(registeredTeams).populateTree(bracket)
        return saveTournament(tournament)
    }

    fun getFirstRoundMatches(tournament: Tournament): List<Match> {
        val bracket = tournament.bracket ?: return listOf()
        val leafFinder = BracketLeafNodeFinder()
        leafFinder.traverseTree(bracket)
        return leafFinder.leafNodes
    }

    fun createBracket(tournament: Tournament): Bracket {
        val bracket = Bracket(tournament)
        tournament.bracket = bracket
        return bracket
    }

    fun getBracketSize(bracket: Bracket): Int {
        val bracketSizeFinder = BracketSizeFinder()
        bracketSizeFinder.traverseTree(bracket)
        return bracketSizeFinder.size
    }

    fun calculateNumberOfMatches(numberOfTeams: Int): Int {
        return BracketCalculator.calculateNumberOfMatchesInBracket(numberOfTeams)
    }
}