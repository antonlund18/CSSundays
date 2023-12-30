package com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPickAndBanPhaseState
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.matchphase.MatchPhaseType
import java.time.LocalDateTime
import java.time.ZoneOffset

class ChangeMatchPhaseStrategyHandlerPickAndBan() :
    ChangeMatchPhaseStrategyHandler {
    override fun execute(match: Match) {
        val phaseType = MatchPhaseType.PICK_AND_BAN
        val state = MatchPickAndBanPhaseState()
        val endTs = LocalDateTime.now(ZoneOffset.UTC).plusSeconds(30)
        val phase = MatchPhase(phaseType = phaseType, state = state, endTs = endTs)
        match.currentPhase = phase
    }
}