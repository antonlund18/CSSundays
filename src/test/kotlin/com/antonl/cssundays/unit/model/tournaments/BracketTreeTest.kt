package com.antonl.cssundays.unit.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.services.model.tournaments.TournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.antonl.cssundays.unit.environment.TestEnvironment
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.fail
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class BracketTreeTest {
    private lateinit var tournamentService: TournamentService
    private lateinit var tournamentRegistrationService: TournamentRegistrationService

    @BeforeEach
    fun setUp() {
        val testEnvironment = TestEnvironment()
        tournamentService = testEnvironment.tournamentService
        tournamentRegistrationService = testEnvironment.tournamentRegistrationService
    }

    @Test
    fun testBracketHasCorrectNumberOfMatches() {
//        testBracketSize(populateTournamentAndGenerateBracket(7), 8)
//        testBracketSize(populateTournamentAndGenerateBracket(8), 8)
//        testBracketSize(populateTournamentAndGenerateBracket(9), 8)
    }

    private fun testBracketSize(tournament: Tournament, expectedSize: Int) {
        tournament.bracket ?: fail()
        val actualSize = tournamentService.getBracketSize(tournament.bracket!!)
        assertEquals(expectedSize, actualSize)
    }

    private fun populateTournamentAndGenerateBracket(numberOfTeams: Int): Tournament {
        var tournament = tournamentService.createTournament("Tournament with 10 teams", "SomeDate", 16)
        createAndRegisterTeams(tournament, numberOfTeams)
        tournamentService.generateBracket(tournament)
        return tournament
    }

    private fun createAndRegisterTeams(tournament: Tournament, numberOfTeams: Int) {
        val teams = generateTeams(numberOfTeams)
        registerTeams(tournament, teams)
    }

    private fun registerTeams(tournament: Tournament, teams: List<Team>) {
        teams.forEach { tournamentRegistrationService.createTournamentRegistration(tournament, it) }
    }

    private fun generateTeams(numberOfTeams: Int): List<Team> {
        val teams = mutableListOf<Team>()

        for (i in 0..numberOfTeams) {
            Team(id = i, name = "Team${1}", owner = User(playertag = "Player${i}", email = "Player${i}@mail.com"))
        }

        return teams;
    }
}