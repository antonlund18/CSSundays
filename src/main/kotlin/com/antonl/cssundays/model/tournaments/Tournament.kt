package com.antonl.cssundays.model.tournaments

import com.antonl.cssundays.model.tournaments.brackets.Bracket
import org.hibernate.annotations.LazyCollection
import org.hibernate.annotations.LazyCollectionOption
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

    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "bracket_id", referencedColumnName = "id")
    var bracket: Bracket? = null,

    @OneToMany(mappedBy = "tournament")
    @LazyCollection(LazyCollectionOption.FALSE)
    val teamRegistrations: MutableList<TournamentRegistration> = mutableListOf(),

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

