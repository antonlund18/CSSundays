package com.antonl.cssundays.model.tournaments.brackets.matches

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "match_ready_check_phase_state")
class MatchReadyCheckPhaseState(
    @OneToOne(cascade = [CascadeType.ALL])
    val teamOneAction: MatchReadyCheckPhaseCaptainPerTeamAction,

    @OneToOne(cascade = [CascadeType.ALL])
    val teamTwoAction: MatchReadyCheckPhaseCaptainPerTeamAction,
) : MatchPhaseState(endTs = LocalDateTime.now().plusMinutes(15))
