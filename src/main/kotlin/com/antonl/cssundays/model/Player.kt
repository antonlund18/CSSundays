package com.antonl.cssundays.model

import com.antonl.cssundays.extensions.toSlug
import java.time.LocalDateTime
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "players")
class Player(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @Column(unique = true)
    var username: String,

    @Column(unique = true)
    var email: String,

    var picture: String = "",

    @GeneratedValue
    var createdTs: String = LocalDateTime.now().toString(),

    var slug: String = username.toSlug(),

    @ManyToMany(mappedBy = "players")
    var teams: MutableList<Team> = mutableListOf()
)