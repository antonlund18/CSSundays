package com.antonl.cssundays.model.notifications.notificationobjects

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.notifications.NotifiableObject
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "invite_to_team")
class InviteToTeam(
    @ManyToOne
    var recipient: User,

    @ManyToOne
    var sender: User,

    @ManyToOne
    var team: Team,

    @Enumerated(EnumType.STRING)
    var status: InviteToTeamStatus = InviteToTeamStatus.PENDING,

    var createdTs: String = LocalDateTime.now().toString()
) : NotifiableObject();

enum class InviteToTeamStatus {
    ACCEPTED,
    DECLINED,
    PENDING
}