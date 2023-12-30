package com.antonl.cssundays.model.tournaments

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import org.hibernate.annotations.LazyCollection
import org.hibernate.annotations.LazyCollectionOption
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.persistence.*

@Entity
@Table(name = "tournament_registrations")
class TournamentRegistration(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Int? = -1,

        @ManyToOne
        @JoinColumn(name = "tournament_id")
        val tournament: Tournament,

        @ManyToOne
        val team: Team,

        @ManyToOne
        val captain: User,

        @ManyToMany(cascade = [CascadeType.ALL])
        @JoinTable(
                name = "player_registered_in_tournament",
                joinColumns = [JoinColumn(name = "tournament_registration_id")],
                inverseJoinColumns = [JoinColumn(name = "user_id")]
        )
        @LazyCollection(LazyCollectionOption.FALSE)
        val players: MutableList<User> = mutableListOf(captain),

        @GeneratedValue
        val createdTs: LocalDateTime = LocalDateTime.now(ZoneOffset.UTC)
)
