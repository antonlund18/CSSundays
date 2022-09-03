package com.antonl.cssundays.model

import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "invite_to_team")
class InviteToTeam(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = -1,

    @ManyToOne
    var player: User,

    @ManyToOne
    var sender: User,

    @ManyToOne
    var team: Team,

    var status: InvitationStatus = InvitationStatus.PENDING,

    @GeneratedValue
    var createdTs: String = LocalDateTime.now().toString(),

    @Column(columnDefinition = "bit default 0")
    var seen: Boolean = false
)

enum class InvitationStatus {
    ACCEPTED,
    DECLINED,
    PENDING
}