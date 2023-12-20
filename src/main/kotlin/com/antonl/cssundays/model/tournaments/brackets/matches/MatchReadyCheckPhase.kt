package com.antonl.cssundays.model.tournaments.brackets.matches

import com.antonl.cssundays.model.core.User
import javax.persistence.Entity
import javax.persistence.Table

@Entity
@Table(name = "match_ready_check_phase_state")
class MatchReadyCheckPhaseState(
    captain1: User,
    captain2: User,
    readyPlayers: MutableList<User> = mutableListOf()
) : MatchPhaseState()