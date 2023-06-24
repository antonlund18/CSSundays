package com.antonl.cssundays.unit.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.Tournament
import com.antonl.cssundays.unit.environment.TestEnvironment
import java.time.LocalDateTime

class BracketTestHelpers {
    companion object {
        private val testEnvironment = TestEnvironment()
        private val tournamentService = testEnvironment.tournamentService
        private val sharedTournamentAndTournamentRegistrationService = testEnvironment.sharedTournamentAndTournamentRegistrationService

        fun populateTournamentAndGenerateBracket(numberOfTeams: Int): Tournament {
            var tournament = tournamentService.createTournament("Tournament with 10 teams", LocalDateTime.now(), 16)
            createAndRegisterTeams(tournament, numberOfTeams)
            tournamentService.generateBracket(tournament)
            return tournament
        }

        fun createAndRegisterTeams(tournament: Tournament, numberOfTeams: Int) {
            val teams = generateTeams(numberOfTeams)
            registerTeams(tournament, teams)
        }

        fun registerTeams(tournament: Tournament, teams: List<Team>) {
            teams.forEach { sharedTournamentAndTournamentRegistrationService.createTournamentRegistration(tournament, it) }
        }

        fun generateTeams(numberOfTeams: Int): List<Team> {
            val teams = mutableListOf<Team>()

            for (i in 1..numberOfTeams) {
                teams.add(
                    Team(
                        id = i,
                        name = "Team${i}",
                        owner = User(playertag = "Player${i}", email = "player${i}@mail.com")
                    )
                )
            }

            return teams;
        }
    }
}