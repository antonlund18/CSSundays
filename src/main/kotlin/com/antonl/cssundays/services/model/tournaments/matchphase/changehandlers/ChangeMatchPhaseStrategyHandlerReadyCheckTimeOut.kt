package com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchReadyCheckPhaseState
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy

class ChangeMatchPhaseStrategyHandlerReadyCheckTimeOut(val matchService: MatchService) :
    ChangeMatchPhaseStrategyHandler {
    override fun execute(match: Match) {
        when (match.currentPhase.state) {
            is MatchReadyCheckPhaseState -> {
                val state = match.currentPhase.state as MatchReadyCheckPhaseState
                val isTeamOneReady = state.teamOneAction.ready
                val isTeamTwoReady = state.teamTwoAction.ready
                if (!isTeamOneReady && !isTeamTwoReady) {
                    matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.CANCELLED)
                    return
                }
                if (!isTeamOneReady) {
                    matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.FINISHED_WIN_TEAM_2)
                    return
                }
                if (!isTeamTwoReady) {
                    matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.FINISHED_WIN_TEAM_1)
                    return
                }
            }
        }
    }
}