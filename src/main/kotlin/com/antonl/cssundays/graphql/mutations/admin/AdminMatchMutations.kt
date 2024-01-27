package com.antonl.cssundays.graphql.mutations.admin

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.services.model.tournaments.SharedTournamentAndTournamentRegistrationService
import com.antonl.cssundays.services.model.tournaments.TournamentRegistrationService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class AdminMatchMutations : Mutation {
    @Autowired
    private lateinit var matchService: MatchService

    @Autowired
    private lateinit var teamService: TeamService

    suspend fun createTestMatch(): Match? {
        return matchService.createTestMatch()
    }

    suspend fun changeMatchPhase(matchId: Int, changeMatchPhaseStrategy: ChangeMatchPhaseStrategy): Match? {
        val match: Match = matchService.getMatchById(matchId) ?: return null
        matchService.changeMatchPhase(match, changeMatchPhaseStrategy)
        matchService.saveMatch(match)
        return match
    }

    suspend fun handleMatchFinished(matchId: Int, winningTeamId: Int): Match? {
        val match: Match = matchService.getMatchById(matchId) ?: return null
        val team: Team = teamService.findTeamById(winningTeamId) ?: return null
        return matchService.handleMatchFinished(match, team)
    }
}