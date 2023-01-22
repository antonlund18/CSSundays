package com.antonl.cssundays.model.core

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "tournaments")
class Tournament(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = -1,

    val name: String,

    val date: String,

    val numberOfTeamsAllowed: Int,

    @OneToMany(mappedBy = "tournament")
    val registeredTeams: MutableList<TournamentRegistration> = mutableListOf(),

    @Enumerated(EnumType.STRING)
    val status: TournamentStatus = TournamentStatus.OPEN_FOR_REGISTRATIONS,

    val published: Boolean = false,

    @GeneratedValue
    val createdTs: String = LocalDateTime.now().toString()
)

enum class TournamentStatus {
    OPEN_FOR_REGISTRATIONS,
    CLOSED_FOR_REGISTRATIONS,
    IN_PROGRESS,
    FINISHED
}

