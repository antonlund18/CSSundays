package com.antonl.cssundays.model

import com.antonl.cssundays.extensions.toSlug
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "players")
class Player(
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    var id: Long? = null,

    @Column(unique = true)
    var username: String,

    @Column(unique = true)
    var email: String,

    var picture: String = "",

    @GeneratedValue
    var createdTs: LocalDateTime = LocalDateTime.now(),

    var slug: String = username.toSlug(),

    @ManyToMany
    var teams: List<Team> = listOf()
)