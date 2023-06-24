package com.antonl.cssundays.services.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.tournaments.*
import com.antonl.cssundays.model.tournaments.brackets.*
import com.antonl.cssundays.repositories.TournamentRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import javax.transaction.Transactional

@Service
@Transactional
class TournamentService(
    val tournamentRepository: TournamentRepository,
    val tournamentRegistrationService: TournamentRegistrationService,
    val sharedTournamentAndTournamentRegistrationService: SharedTournamentAndTournamentRegistrationService
) {
    fun saveTournament(tournament: Tournament): Tournament {
        return tournamentRepository.save(tournament)
    }

    fun getAllTournaments(): List<Tournament> {
        return tournamentRepository.findAll().toList()
    }

    fun createTournament(name: String, date: LocalDateTime, numberOfTeamsAllowed: Int): Tournament {
        val tournament = Tournament(
            name = name,
            startDateAndTime = date,
            numberOfTeamsAllowed = numberOfTeamsAllowed
        )
        saveTournament(tournament)
        return tournament
    }

    fun getTournamentById(id: Int): Tournament? {
        return tournamentRepository.findById(id)
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
        return BracketLeafNodeFinder().traverseTree(bracket).getLeafNodes()
    }

    fun createBracket(tournament: Tournament): Bracket {
        val bracket = Bracket(tournament)
        tournament.bracket = bracket
        return bracket
    }

    fun getBracketSize(bracket: Bracket): Int {
        return BracketSizeFinder().traverseTree(bracket).size
    }

    fun calculateNumberOfMatches(numberOfTeams: Int): Int {
        return BracketCalculator.calculateNumberOfMatchesInBracket(numberOfTeams)
    }
}