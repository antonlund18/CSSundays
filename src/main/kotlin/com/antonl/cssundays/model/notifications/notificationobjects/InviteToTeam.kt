package com.antonl.cssundays.model.notifications.notificationobjects

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.NotifiableObject
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "invite_to_team")
class InviteToTeam(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    override var id: Int? = -1,

    @ManyToOne
    var recipient: User,

    @ManyToOne
    var sender: User,

    @ManyToOne
    var team: Team,

    var status: InvitationStatus = InvitationStatus.PENDING,

    @GeneratedValue
    var createdTs: String = LocalDateTime.now().toString()
) : NotifiableObject(id);

enum class InvitationStatus {
    ACCEPTED,
    DECLINED,
    PENDING
}