package com.antonl.cssundays.model

import com.antonl.cssundays.extensions.toSlug
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "teams")
class Team(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(unique = true)
    var name: String,

    var picture: String = "",

    @ManyToOne
    var owner: Player,

    @ManyToMany
    @JoinTable(
        name = "player_on_team",
        joinColumns = [JoinColumn(name = "team_id")],
        inverseJoinColumns = [JoinColumn(name = "player_id")]
    )
    var players: MutableList<Player> = mutableListOf(),

    var slug: String = name.toSlug(),

    var createdTs: LocalDateTime = LocalDateTime.now()
)