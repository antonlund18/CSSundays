package com.antonl.cssundays.model.tournaments

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "brackets")
class Bracket(
    @OneToOne(mappedBy = "bracket")
    val tournament: Tournament? = null,

    val createdTs: String = LocalDateTime.now().toString(),
) : PersistedTree<Match>()