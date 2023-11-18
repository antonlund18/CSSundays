package com.antonl.cssundays.model.core

import com.antonl.cssundays.extensions.toSlug
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "users")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @Column(unique = true)
    var playertag: String,

    @Column(unique = true)
    var email: String,

    var description: String = "",

    var password: String = "",

    var picture: String? = null,

    @Enumerated(EnumType.STRING)
    var role: UserRole = UserRole.USER,

    @GeneratedValue
    var createdTs: LocalDateTime = LocalDateTime.now(),

    var slug: String = playertag.toSlug(),

    @ManyToMany(mappedBy = "users", fetch = FetchType.EAGER)
    var teams: MutableList<Team> = mutableListOf()
)

enum class UserRole {
    ADMIN,
    ORGANIZER,
    USER,
    NONE,
}