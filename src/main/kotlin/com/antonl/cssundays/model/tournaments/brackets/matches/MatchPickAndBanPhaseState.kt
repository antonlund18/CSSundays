package com.antonl.cssundays.model.tournaments.brackets.matches

import org.hibernate.annotations.LazyCollection
import org.hibernate.annotations.LazyCollectionOption
import javax.persistence.CascadeType
import javax.persistence.Entity
import javax.persistence.OneToMany
import javax.persistence.Table

@Entity
@Table(name = "match_pick_and_ban_phase_state")
class MatchPickAndBanPhaseState(
    @OneToMany(mappedBy = "state", cascade = [CascadeType.ALL])
    @LazyCollection(LazyCollectionOption.FALSE)
    val actions: MutableList<MatchPickAndBanPhaseAction> = mutableListOf(),

    val firstTeamToBan: Int = (1..2).random(),

    val votingTimeInSeconds: Int = 30
) : MatchPhaseState()
