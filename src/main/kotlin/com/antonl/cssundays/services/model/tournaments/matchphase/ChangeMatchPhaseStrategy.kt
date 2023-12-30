package com.antonl.cssundays.services.model.tournaments.matchphase

enum class ChangeMatchPhaseStrategy {
    CANCELLED,
    WAITING_FOR_TEAMS,
    WAITING_TO_START,
    READY_CHECK_ONE_CAPTAIN_PER_TEAM,
    READY_CHECK_TIME_OUT,
    PICK_AND_BAN_BO1,
    PICK_AND_BAN_TIMEOUT,
    IN_PROGRESS,
    FINISHED_WIN_TEAM_1,
    FINISHED_WIN_TEAM_2
}