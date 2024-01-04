package com.antonl.cssundays.model.tournaments.brackets.matches

import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.Table

@Entity
@Table(name = "match_in_progress_phase_state")
class MatchInProgressPhaseState(
    @Enumerated(EnumType.STRING)
    var map: CSMap? = null
) : MatchPhaseState()