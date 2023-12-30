package com.antonl.cssundays.services.model.tournaments.matchphase

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