package com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchReadyCheckPhaseCaptainPerTeamAction
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchReadyCheckPhaseState
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.services.model.tournaments.matchphase.ChangeMatchPhaseStrategy
import com.antonl.cssundays.services.model.tournaments.matchphase.MatchPhaseType
import java.time.LocalDateTime
import java.time.ZoneOffset

class ChangeMatchPhaseStrategyHandlerReadyCheckOneCaptainPerTeam(val matchService: MatchService) :
    ChangeMatchPhaseStrategyHandler {
    override fun execute(match: Match) {
        val tournamentRegistration1 = match.tournamentRegistration1
        val tournamentRegistration2 = match.tournamentRegistration2
        if (tournamentRegistration1?.captain != null && tournamentRegistration2?.captain != null) {
            val teamOneAction = MatchReadyCheckPhaseCaptainPerTeamAction(captain = tournamentRegistration1.captain)
            val teamTwoAction = MatchReadyCheckPhaseCaptainPerTeamAction(captain = tournamentRegistration2.captain)
            val state = MatchReadyCheckPhaseState(teamOneAction, teamTwoAction)
            val phaseType = MatchPhaseType.READY_CHECK
            val endTs = LocalDateTime.now(ZoneOffset.UTC).plusMinutes(15)
            match.currentPhase = MatchPhase(match = match, phaseType = phaseType, state = state, endTs = endTs)
            matchService.scheduleChangeMatchPhase(match, ChangeMatchPhaseStrategy.READY_CHECK_TIME_OUT, endTs)
        }
    }
}