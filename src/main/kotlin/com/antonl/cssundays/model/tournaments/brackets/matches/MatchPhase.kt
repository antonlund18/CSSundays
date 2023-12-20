package com.antonl.cssundays.model.tournaments.brackets.matches

import com.antonl.cssundays.model.tournaments.brackets.Match
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "match_phase")
class MatchPhase(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    val id: Int? = -1,

    @ManyToOne
    @JoinColumn(name =  "match_id", referencedColumnName = "id")
    var match: Match? = null,

    @Enumerated(EnumType.STRING)
    val phase: MatchPhaseType = MatchPhaseType.WAITING_FOR_TEAMS,

    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "match_phase_state_id", referencedColumnName = "id")
    var state: MatchPhaseState? = null,
)

enum class MatchPhaseType {
    CANCELLED,
    WAITING_FOR_TEAMS,
    WAITING_TO_START,
    READY_CHECK,
    PICK_AND_BAN,
    IN_PROGRESS,
    WIN_TEAM_1,
    WIN_TEAM_2
}