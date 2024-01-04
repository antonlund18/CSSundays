package com.antonl.cssundays.model.tournaments.brackets.matches

enum class MatchPhaseType {
    INITIALIZING,
    CANCELLED,
    WAITING_FOR_TEAMS,
    WAITING_TO_START,
    READY_CHECK,
    PICK_AND_BAN,
    IN_PROGRESS,
    FINISHED
}