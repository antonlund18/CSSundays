package com.antonl.cssundays.model

import com.antonl.cssundays.extensions.toSlug
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = -1,

    @Column(unique = true)
    var playertag: String,

    @Column(unique = true)
    var email: String,

    var password: String = "",

    var picture: String? = null,

    var role: UserRole = UserRole.USER,

    @GeneratedValue
    var createdTs: String = LocalDateTime.now().toString(),

    var slug: String = playertag.toSlug(),

    @ManyToMany(mappedBy = "users", fetch = FetchType.EAGER)
    var teams: MutableList<Team> = mutableListOf()
)