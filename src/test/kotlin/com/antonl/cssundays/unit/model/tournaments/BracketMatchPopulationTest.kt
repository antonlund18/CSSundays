package com.antonl.cssundays.unit.model.tournaments

import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.antonl.cssundays.unit.environment.TestEnvironment
import com.antonl.cssundays.unit.model.tournaments.BracketTestHelpers.Companion.populateTournamentAndGenerateBracket
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.fail
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class BracketMatchPopulationTest {
    private lateinit var tournamentService: TournamentService

    @BeforeEach
    fun setUp() {
        tournamentService = TestEnvironment().tournamentService
    }

    @Test
    fun testBracketHasCorrectNumberOfMatches() {
        testBracketSize(0, 1)
        testBracketSize(1, 1)
        testBracketSize(2, 1)
        testBracketSize(3, 3)
        testBracketSize(7, 7)
        testBracketSize(8, 7)
        testBracketSize(9, 15)
        testBracketSize(16, 15)
        testBracketSize(17, 31)
    }

    private fun testBracketSize(numberOfTeams: Int, expectedSize: Int) {
        val tournament = populateTournamentAndGenerateBracket(numberOfTeams)
        val bracket = tournament.bracket ?: fail()
        val actualSize = tournamentService.getBracketSize(bracket)
        assertEquals(expectedSize, actualSize)
    }
}