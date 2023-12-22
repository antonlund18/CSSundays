package com.antonl.cssundays.model.tournaments.brackets.matches

import com.antonl.cssundays.model.tournaments.brackets.Match
import javax.persistence.*

@Entity
@Table(name = "match_phase")
class MatchPhase(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    val id: Int = -1,

    @ManyToOne
    @JoinTable(
        name = "match_and_match_phase",
        joinColumns = [JoinColumn(name = "match_phase_id")],
        inverseJoinColumns = [JoinColumn(name = "match_id")]
    )
    var match: Match? = null,

    @Enumerated(EnumType.STRING)
    var phaseType: MatchPhaseType = MatchPhaseType.WAITING_FOR_TEAMS,

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
    FINISHED
}

enum class ChangeMatchPhaseStrategy {
    CANCELLED,
    WAITING_FOR_TEAMS,
    WAITING_TO_START,
    READY_CHECK_ONE_CAPTAIN_PER_TEAM,
    PICK_AND_BAN_BO1,
    IN_PROGRESS,
    FINISHED_WIN_TEAM_1,
    FINISHED_WIN_TEAM_2
}