package com.antonl.cssundays.model.tournaments.brackets.matches

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
abstract class MatchPhaseState(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    open var id: Int = -1,

    open val createdTs: LocalDateTime = LocalDateTime.now(),

    open val endTs: LocalDateTime? = null
)