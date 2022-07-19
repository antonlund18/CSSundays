package com.antonl.cssundays.model

import com.antonl.cssundays.extensions.toSlug
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "teams")
class Team(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = -1,

    @Column(unique = true)
    var name: String,

    var picture: String = "",

    @ManyToOne
    var owner: User,

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_on_team",
        joinColumns = [JoinColumn(name = "team_id")],
        inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var users: MutableList<User> = mutableListOf(),

    var wins: Int = 0,

    var losses: Int = 0,

    var slug: String = name.toSlug(),

    var createdTs: String = LocalDateTime.now().toString(),
)