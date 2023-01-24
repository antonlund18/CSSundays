package com.antonl.cssundays.model.tournaments

import com.antonl.cssundays.model.core.Team
import java.time.LocalDateTime

class Match(
    val id: Int? = -1,
    val team1: Team? = null,
    val team2: Team? = null,
    val createdTs: LocalDateTime = LocalDateTime.now(),
    val result: MatchResult = MatchResult.COMING_UP
)


enum class MatchResult {
    WIN_TEAM_1,
    WIN_TEAM_2,
    IN_PROGRESS,
    COMING_UP
}