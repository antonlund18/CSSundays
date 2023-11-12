package com.antonl.cssundays.unit.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.tournaments.brackets.BracketLeafNodeFinder
import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.services.model.tournaments.SharedTournamentAndTournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentService
import com.antonl.cssundays.unit.environment.TestEnvironment
import com.antonl.cssundays.unit.model.tournaments.BracketTestHelpers.Companion.populateTournamentAndGenerateBracket
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class BracketTeamPopulationTest {
    private lateinit var tournamentService: TournamentService
    private lateinit var tournamentRegistrationService: TournamentRegistrationService
    private lateinit var sharedTournamentAndTournamentRegistrationService: SharedTournamentAndTournamentRegistrationService

    @BeforeEach
    fun setUp() {
        val testEnvironment = TestEnvironment()
        tournamentService = testEnvironment.tournamentService
        tournamentRegistrationService = testEnvironment.tournamentRegistrationService
        sharedTournamentAndTournamentRegistrationService =
            testEnvironment.sharedTournamentAndTournamentRegistrationService
    }

    @Test
    fun testBracketGetsCorrectlyPopulated() {
        testTeamPopulationInMatches(0)
        testTeamPopulationInMatches(3)
        testTeamPopulationInMatches(7)
        testTeamPopulationInMatches(8)
        testTeamPopulationInMatches(9)
        testTeamPopulationInMatches(16)
        testTeamPopulationInMatches(17)
    }

    private fun testTeamPopulationInMatches(numberOfTeams: Int) {
        val tournament = populateTournamentAndGenerateBracket(numberOfTeams)
        val bracket = tournament.bracket ?: fail()

        val allMatches = BracketLeafNodeFinder().traverseTree(bracket).getAllNodes()
        val matchesWithOneTeam = allMatches.filter { matchHasXTeams(it, 1) }
        val matchesWithTwoTeams = allMatches.filter { matchHasXTeams(it, 2) }
        val matchesWithTeams = matchesWithOneTeam.plus(matchesWithTwoTeams)

        assertEquals(numberOfTeams % 2, matchesWithOneTeam.size)
        assertEquals(numberOfTeams / 2, matchesWithTwoTeams.size)

        matchesWithOneTeam.forEach { testMatchWithOneTeamIsCorrectlyPopulated(it) }
        matchesWithTwoTeams.forEach { testMatchWithTwoTeamsCorrectlyPopulated(it) }

        val teams = mutableListOf<Team>()
        matchesWithTeams.forEach { match ->
            match.team1?.let { team -> teams.add(team) }
            match.team2?.let { team -> teams.add(team) }
        }
        assertEquals(numberOfTeams, teams.distinct().size)
    }

    private fun testMatchWithOneTeamIsCorrectlyPopulated(match: Match) {
        assertTrue(matchHasXTeams(match, 1))

        assertNotNull(match.left)
        assertNotNull(match.right)

        assertTrue(isLeafNode(match.left!!))
        assertTrue(isLeafNode(match.right!!))

        assertTrue(matchHasXTeams(match.left!!, 2) || matchHasXTeams(match.right!!, 2))
        assertTrue(matchHasXTeams(match.left!!, 0) || matchHasXTeams(match.right!!, 0))
    }

    private fun testMatchWithTwoTeamsCorrectlyPopulated(match: Match) {
        if (isLeafNode(match)) {
            testLeafNodeWithTwoTeamsCorrectlyPopulated(match)
        } else {
            assertNotNull(match.left)
            assertNotNull(match.right)
            assertTrue(matchHasXTeams(match.left!!, 0))
            assertTrue(matchHasXTeams(match.right!!, 0))
            assertTrue(isLeafNode(match.left!!))
            assertTrue(isLeafNode(match.right!!))
        }
    }

    private fun testLeafNodeWithTwoTeamsCorrectlyPopulated(match: Match) {
        match.parent?.let { parent ->
            if (matchHasXTeams(parent, 1)) {
                testMatchWithOneTeamIsCorrectlyPopulated(parent!!)
            } else {
                assertTrue(matchHasXTeams(parent, 0))
                assertNotNull(parent.left)
                assertNotNull(parent.right)
                assertTrue(matchHasXTeams(parent.left!!, 2))
                assertTrue(matchHasXTeams(parent.right!!, 2))
                assertTrue(isLeafNode(parent.left!!))
                assertTrue(isLeafNode(parent.right!!))
            }
        } ?: run {
            assertTrue(matchHasXTeams(match, 2))
        }
    }

    private fun isLeafNode(match: Match): Boolean {
        return match.left == null && match.right == null
    }

    private fun matchHasXTeams(match: Match, x: Int): Boolean {
        var count = 0
        match.team1?.let { count++ }
        match.team2?.let { count++ }
        return count == x
    }
}