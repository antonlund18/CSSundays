package com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhaseType

class ChangeMatchPhaseStrategyHandlerWaitingForTeams : ChangeMatchPhaseStrategyHandler {
    override fun execute(match: Match) {
        match.currentPhase = MatchPhase(match = match, phaseType = MatchPhaseType.WAITING_FOR_TEAMS)
    }
}