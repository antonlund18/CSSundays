package com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.matchphase.MatchPhaseType

class ChangeMatchPhaseStrategyHandlerReadyCheckTimeOut(val matchService: MatchService) :
    ChangeMatchPhaseStrategyHandler {
    override fun execute(match: Match) {
        when (match.currentPhase.phaseType) {
            MatchPhaseType.READY_CHECK -> {
                matchService.changeMatchPhase(match, ChangeMatchPhaseStrategy.PICK_AND_BAN_BO1)
            }
            else -> {
                // Do nothing
            }
        }
    }
}