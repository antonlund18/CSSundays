package com.antonl.cssundays.model

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "InviteToTeam")
class InviteToTeam(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = - 1,

    @ManyToOne
    var player: User,

    @ManyToOne
    var team: Team,

    var status: InvitationStatus = InvitationStatus.PENDING,

    @GeneratedValue
    var createdTs: String = LocalDateTime.now().toString(),
)