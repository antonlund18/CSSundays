package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.model.tournaments.TournamentRegistration
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchChatMessage
import com.antonl.cssundays.model.tournaments.brackets.matches.MatchPhase
import com.antonl.cssundays.model.util.PersistedNodeWithParent
import org.hibernate.annotations.LazyCollection
import org.hibernate.annotations.LazyCollectionOption
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.persistence.*

@Entity
@Table(name = "matches")
class Match(
    @OneToOne(cascade = [CascadeType.ALL])
    var tournamentRegistration1: TournamentRegistration? = null,

    @OneToOne(cascade = [CascadeType.ALL])
    var tournamentRegistration2: TournamentRegistration? = null,

    val createdTs: LocalDateTime = LocalDateTime.now(ZoneOffset.UTC),

    @OneToOne(cascade = [CascadeType.ALL])
    var currentPhase: MatchPhase = MatchPhase(),

    @OneToMany(mappedBy = "match")
    val allPhases: MutableList<MatchPhase> = mutableListOf(),

    @OneToMany(mappedBy = "match", cascade = [CascadeType.ALL])
    @LazyCollection(LazyCollectionOption.FALSE)
    val chatMessages: MutableList<MatchChatMessage> = mutableListOf(),

    parent: Match? = null
) : PersistedNodeWithParent<Match>(parent) {
    init {
        currentPhase.match = this
    }
}