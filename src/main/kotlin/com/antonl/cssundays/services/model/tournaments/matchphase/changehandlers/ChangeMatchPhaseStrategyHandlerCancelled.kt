package com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.antonl.cssundays.services.model.tournaments.matchphase.MatchPhaseType

class ChangeMatchPhaseStrategyHandlerCancelled : ChangeMatchPhaseStrategyHandler {
    override fun execute(match: Match) {
        val phaseType = MatchPhaseType.CANCELLED
        match.currentPhase = MatchPhase(match = match, phaseType = phaseType)
    }
}