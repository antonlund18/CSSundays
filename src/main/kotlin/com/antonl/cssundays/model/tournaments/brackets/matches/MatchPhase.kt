package com.antonl.cssundays.model.tournaments.brackets.matches

import com.antonl.cssundays.model.tournaments.brackets.Match
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

    val endTs: LocalDateTime? = null
)

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

enum class ChangeMatchPhaseStrategy {
    CANCELLED,
    WAITING_FOR_TEAMS,
    WAITING_TO_START,
    READY_CHECK_ONE_CAPTAIN_PER_TEAM,
    READY_CHECK_TIME_OUT,
    PICK_AND_BAN_BO1,
    IN_PROGRESS,
    FINISHED_WIN_TEAM_1,
    FINISHED_WIN_TEAM_2
}