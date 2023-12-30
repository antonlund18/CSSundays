package com.antonl.cssundays.services.model.tournaments.matchphase

import com.antonl.cssundays.services.model.tournaments.MatchService
import com.antonl.cssundays.services.model.tournaments.matchphase.changehandlers.*

class ChangeMatchPhaseStrategyHandlerFactory(val matchService: MatchService) {
    private val handlerMap = mapOf(
        ChangeMatchPhaseStrategy.CANCELLED to ChangeMatchPhaseStrategyHandlerCancelled(),
        ChangeMatchPhaseStrategy.WAITING_FOR_TEAMS to ChangeMatchPhaseStrategyHandlerWaitingForTeams(),
//        ChangeMatchPhaseStrategy.WAITING_TO_START to TODO(),
        ChangeMatchPhaseStrategy.READY_CHECK_ONE_CAPTAIN_PER_TEAM to ChangeMatchPhaseStrategyHandlerReadyCheckOneCaptainPerTeam(matchService),
        ChangeMatchPhaseStrategy.READY_CHECK_TIME_OUT to ChangeMatchPhaseStrategyHandlerReadyCheckTimeOut(matchService),
        ChangeMatchPhaseStrategy.PICK_AND_BAN_BO1 to ChangeMatchPhaseStrategyHandlerPickAndBan(),
//        ChangeMatchPhaseStrategy.IN_PROGRESS to TODO(),
//        ChangeMatchPhaseStrategy.FINISHED_WIN_TEAM_1 to TODO(),
//        ChangeMatchPhaseStrategy.FINISHED_WIN_TEAM_2 to TODO(),
    )

    fun getHandler(strategy: ChangeMatchPhaseStrategy): ChangeMatchPhaseStrategyHandler {
        return handlerMap[strategy] ?: throw Exception("Strategy $strategy not found.")
    }
}