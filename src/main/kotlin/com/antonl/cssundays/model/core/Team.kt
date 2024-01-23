package com.antonl.cssundays.model.core

import com.antonl.cssundays.extensions.toSlug
import com.antonl.cssundays.model.search.Searchable
import java.time.LocalDateTime
import java.time.ZoneOffset
import javax.persistence.*

@Entity
@Table(name = "teams")
class Team(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = -1,

    @Column(unique = true)
    var name: String,

    var picture: String? = null,

    @ManyToOne
    var owner: User,

    @ManyToMany(fetch = FetchType.EAGER, cascade = [CascadeType.ALL])
    @JoinTable(
        name = "user_on_team",
        joinColumns = [JoinColumn(name = "team_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var users: MutableList<User> = mutableListOf(),

    var wins: Int = 0,

    var losses: Int = 0,

    var slug: String = name.toSlug(),

    var createdTs: LocalDateTime = LocalDateTime.now(ZoneOffset.UTC),
): Searchable