package com.antonl.cssundays.unit.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

internal class BracketTreeTest {

    @BeforeEach
    fun setUp() {

    }

    @Test
    fun generateBracket(numberOfTeams: Int) {
        val teams = mutableListOf<Team>()

        for (i in 0..numberOfTeams) {
            Team(id = i, name = "Team${1}", owner = User(playertag = "Player${i}", email = "Player${i}@mail.com"))
        }

        val bracket = Bracket()
        val numberOfMatches = BracketCalculator.calculateNumberOfMatchesInBracket(numberOfTeams)
        BracketMatchInitializer(numberOfMatches).traverseTree(bracket)
        BracketTeamPopulator(teams).populateTree(bracket)
    }
}