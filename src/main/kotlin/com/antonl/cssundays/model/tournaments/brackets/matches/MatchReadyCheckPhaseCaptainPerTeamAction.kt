package com.antonl.cssundays.model.tournaments.brackets.matches

import com.antonl.cssundays.model.core.User
import javax.persistence.*

@Entity
@Table(name = "match_ready_check_phase_captain_per_team_action")
class MatchReadyCheckPhaseCaptainPerTeamAction(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @ManyToOne
    val captain: User,

    val ready: Boolean = false
)