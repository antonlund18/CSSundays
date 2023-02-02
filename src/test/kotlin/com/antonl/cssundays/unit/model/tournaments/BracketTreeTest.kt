package com.antonl.cssundays.unit.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.*
import org.junit.jupiter.api.Test

internal class BracketTreeTest {

    @Test
    fun generateBracket() {
        val teams = listOf<Team>(
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = "")),
            Team(name = "Test", owner = User(playertag = "", email = ""))
        )

        val bracket = Bracket()
        BracketMatchInitializer(15).traverseTree(bracket)
        BracketTeamPopulator(teams).populateTree(bracket)
        BracketTreePrinter().traverseTree(bracket)
    }
}