package com.antonl.cssundays.model.tournaments.brackets.matches

import com.antonl.cssundays.model.core.User
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.persistence.*

@Entity
@Table(name = "match_pick_and_ban_phase_action")
class MatchPickAndBanPhaseAction(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @ManyToOne
    val captain: User,

    @Enumerated(EnumType.STRING)
    val ban: CSMap,

    val createdTs: LocalDateTime = LocalDateTime.now(ZoneOffset.UTC),

    @ManyToOne
    val state: MatchPickAndBanPhaseState,
)