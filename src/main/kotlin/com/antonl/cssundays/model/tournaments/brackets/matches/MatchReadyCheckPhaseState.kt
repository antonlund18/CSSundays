package com.antonl.cssundays.model.tournaments.brackets.matches

import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.OneToOne
import javax.persistence.Table

@Entity
@Table(name = "match_ready_check_phase_state")
class MatchReadyCheckPhaseState(
    @OneToOne(cascade = [CascadeType.ALL])
    val teamOneAction: MatchReadyCheckPhaseCaptainPerTeamAction,

    @OneToOne(cascade = [CascadeType.ALL])
    val teamTwoAction: MatchReadyCheckPhaseCaptainPerTeamAction,
) : MatchPhaseState()
