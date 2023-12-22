package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.antonl.cssundays.model.util.PersistedNodeWithParent
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "matches")
class Match(
    @OneToOne(cascade = [CascadeType.ALL])
    var team1: Team? = null,

    @OneToOne(cascade = [CascadeType.ALL])
    var team2: Team? = null,

    val createdTs: LocalDateTime = LocalDateTime.now(),

    @OneToOne(cascade = [CascadeType.ALL])
    val currentPhase: MatchPhase = MatchPhase(),

    @OneToMany(mappedBy = "match")
    val allPhases: MutableList<MatchPhase> = mutableListOf(currentPhase),

    parent: Match? = null
) : PersistedNodeWithParent<Match>(parent) {
    init {
        currentPhase.match = this
    }
}