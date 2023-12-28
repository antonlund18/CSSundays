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
    @SequenceGenerator(name = "tournament_id_generator", sequenceName = "tournament_id_sequence", allocationSize = 1)
    @GeneratedValue(generator = "tournament_id_generator", strategy = GenerationType.SEQUENCE)
    val id: Int?,

    val name: String,

    var picture: String? = null,

    @Column(columnDefinition = "NTEXT")
    var description: String = "",

    @Column(columnDefinition = "NTEXT")
    var rules: String = "",

    @Enumerated(EnumType.STRING)
    var format: TournamentFormat = TournamentFormat.SINGLE_ELIMINATION,

    val startDateAndTime: LocalDateTime,

    val numberOfTeamsAllowed: Int,

    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "bracket_id", referencedColumnName = "id")
    var bracket: Bracket? = null,

    @OneToMany(mappedBy = "tournament", cascade = [CascadeType.ALL])
    @LazyCollection(LazyCollectionOption.FALSE)
    val tournamentRegistrations: MutableList<TournamentRegistration> = mutableListOf(),

    @Enumerated(EnumType.STRING)
    val status: TournamentStatus = TournamentStatus.OPEN_FOR_REGISTRATIONS,

    var published: Boolean = false,

    @GeneratedValue
    val createdTs: LocalDateTime = LocalDateTime.now()
) {
    constructor() : this(null, "", null, "", "", TournamentFormat.SINGLE_ELIMINATION, LocalDateTime.now(), 64)
    constructor(
        name: String,
        picture: String? = null,
        description: String = "",
        rules: String = "",
        format: TournamentFormat = TournamentFormat.SINGLE_ELIMINATION,
        startDateAndTime: LocalDateTime,
        numberOfTeamsAllowed: Int,
        bracket: Bracket? = null,
        teamRegistrations: MutableList<TournamentRegistration> = mutableListOf(),
        status: TournamentStatus = TournamentStatus.OPEN_FOR_REGISTRATIONS,
        published: Boolean = false,
        createdTs: LocalDateTime = LocalDateTime.now()
    ) :
            this(
                null,
                name,
                picture,
                description,
                rules,
                format,
                startDateAndTime,
                numberOfTeamsAllowed,
                bracket,
                teamRegistrations,
                status,
                published,
                createdTs
            )
}

enum class TournamentStatus {
    OPEN_FOR_REGISTRATIONS,
    CLOSED_FOR_REGISTRATIONS,
    IN_PROGRESS,
    FINISHED
}
