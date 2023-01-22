package com.antonl.cssundays.model.core

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "tournament_registration")
class TournamentRegistration(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = -1,

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    val tournament: Tournament,

    @ManyToOne
    val team: Team,

    @GeneratedValue
    val createdTs: String = LocalDateTime.now().toString()
)
