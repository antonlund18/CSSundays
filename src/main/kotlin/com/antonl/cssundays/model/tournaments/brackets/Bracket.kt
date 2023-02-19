package com.antonl.cssundays.model.tournaments.brackets

import com.antonl.cssundays.model.util.PersistedTree
import com.antonl.cssundays.model.tournaments.Tournament
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "brackets")
class Bracket(
    @OneToOne(mappedBy = "bracket")
    val tournament: Tournament? = null,

    val createdTs: String = LocalDateTime.now().toString(),
) : PersistedTree<Match>()