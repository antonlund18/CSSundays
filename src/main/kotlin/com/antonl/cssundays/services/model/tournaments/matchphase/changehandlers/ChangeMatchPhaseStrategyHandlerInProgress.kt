package com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchInProgressPhaseState
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhaseType

class ChangeMatchPhaseStrategyHandlerInProgress(val matchService: MatchService) :
    ChangeMatchPhaseStrategyHandler {
    override fun execute(match: Match) {
        val phaseType = MatchPhaseType.IN_PROGRESS
        val state = MatchInProgressPhaseState()
        val phase = MatchPhase(phaseType = phaseType, state = state)
        match.currentPhase = phase
    }
}