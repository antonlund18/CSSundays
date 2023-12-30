package com.antonl.cssundays.model.tournaments.brackets.matches

import com.antonl.cssundays.model.core.User
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "match_ready_check_phase_captain_per_team_action")
class MatchPickAndBanPhaseAction(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @ManyToOne
    val captain: User,

    @Enumerated(EnumType.STRING)
    val ban: CSMap,

    val createdTs: LocalDateTime = LocalDateTime.now(),

    @ManyToOne
    val state: MatchPickAndBanPhaseState,
)