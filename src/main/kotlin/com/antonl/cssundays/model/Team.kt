package com.antonl.cssundays.model

import com.antonl.cssundays.extensions.toSlug
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "teams")
class Team(
    @Id @GeneratedValue var id: Long? = null,
    var name: String,
    var picture: String = "",
    @ManyToOne var owner: Player,
    @ManyToMany var players: List<Player> = listOf(),
    var slug: String = name.toSlug(),
    var createdTs: LocalDateTime = LocalDateTime.now()
)