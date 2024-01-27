package com.antonl.cssundays.model.tournaments.brackets.matches

import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.Table

@Entity
@Table(name = "match_finished_phase_state")
class MatchFinishedPhaseState(
    var winTeamOne: Boolean
) : MatchPhaseState()