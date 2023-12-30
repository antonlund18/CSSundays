package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.model.util.PersistedTree
import com.antonl.cssundays.model.tournaments.Tournament
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.persistence.*

@Entity
@Table(name = "brackets")
class Bracket(
    @OneToOne(mappedBy = "bracket")
    val tournament: Tournament? = null,

    val createdTs: LocalDateTime = LocalDateTime.now(ZoneOffset.UTC),
) : PersistedTree<Match>()