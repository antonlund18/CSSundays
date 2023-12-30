package com.antonl.cssundays.model.tournaments.brackets.matches

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.services.model.tournaments.matchphase.MatchPhaseType
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.persistence.*

@Entity
@Table(name = "match_phase")
class MatchPhase(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    val id: Int = -1,

    @ManyToOne
    var match: Match? = null,

    @Enumerated(EnumType.STRING)
    var phaseType: MatchPhaseType = MatchPhaseType.INITIALIZING,

    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "match_phase_state_id", referencedColumnName = "id")
    var state: MatchPhaseState? = null,

    val createdTs: LocalDateTime = LocalDateTime.now(ZoneOffset.UTC),

    var endTs: LocalDateTime? = null
)

