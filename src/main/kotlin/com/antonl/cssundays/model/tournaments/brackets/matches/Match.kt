package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.antonl.cssundays.model.util.PersistedNodeWithParent
import java.time.LocalDateTime
import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.OneToOne
import javax.persistence.Table

@Entity
@Table(name = "matches")
class Match(
    @OneToOne
    var team1: Team? = null,

    @OneToOne
    var team2: Team? = null,

    val createdTs: LocalDateTime = LocalDateTime.now(),

    @OneToOne(cascade = [CascadeType.ALL])
    val phase: MatchPhase = MatchPhase(),

    parent: Match? = null
) : PersistedNodeWithParent<Match>(parent) {
    init {
        phase.match = this
    }
}