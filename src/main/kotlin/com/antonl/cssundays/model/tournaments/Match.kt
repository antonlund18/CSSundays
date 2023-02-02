package com.antonl.cssundays.model.tournaments

import com.antonl.cssundays.model.core.Team
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "matches")
class Match(
    @OneToOne
    var team1: Team? = null,

    @OneToOne
    var team2: Team? = null,

    val createdTs: String = LocalDateTime.now().toString(),

    @Enumerated(EnumType.STRING)
    val result: MatchResult = MatchResult.COMING_UP,

    parent: Match? = null
) : PersistedNodeWithParent<Match>(parent)


enum class MatchResult {
    WIN_TEAM_1,
    WIN_TEAM_2,
    IN_PROGRESS,
    COMING_UP,
    CANCELLED
}