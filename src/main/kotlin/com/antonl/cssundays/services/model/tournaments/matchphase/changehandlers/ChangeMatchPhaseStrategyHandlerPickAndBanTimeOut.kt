package com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.CSMap
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPickAndBanPhaseState
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhaseType
import java.time.LocalDateTime
import java.time.ZoneOffset

class ChangeMatchPhaseStrategyHandlerPickAndBanTimeOut(val matchService: MatchService) :
    ChangeMatchPhaseStrategyHandler {
    override fun execute(match: Match) {
        if (match.currentPhase.phaseType !== MatchPhaseType.PICK_AND_BAN || match.currentPhase.state !is MatchPickAndBanPhaseState) {
            return
        }

        val state = match.currentPhase.state as MatchPickAndBanPhaseState

        for (action in state.actions) {
            val timeoutActionTs = LocalDateTime.now(ZoneOffset.UTC).minusSeconds(state.votingTimeInSeconds.toLong())
            if (action.createdTs.isAfter(timeoutActionTs)) {
                return
            }
        }

        val alreadyBannedMaps = state.actions.map { it.ban }
        val notBannedMaps = mutableListOf(*CSMap.values())
        notBannedMaps.removeAll(alreadyBannedMaps)
        val mapToBeBanned = notBannedMaps[(0..notBannedMaps.size - 1).random()]

        val isTeamOneToBan = (state.firstTeamToBan + state.actions.size) % 2 == 1
        val captain = (if (isTeamOneToBan) match.tournamentRegistration1?.captain else match.tournamentRegistration2?.captain)
            ?: return

        matchService.banMap(match, captain, mapToBeBanned)
    }
}