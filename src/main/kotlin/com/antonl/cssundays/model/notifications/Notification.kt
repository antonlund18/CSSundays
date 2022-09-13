package com.antonl.cssundays.model.notifications

import com.antonl.cssundays.model.core.User
import javax.persistence.*

@Entity
@Table(name = "notifications")
class Notification(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = -1,

    @ManyToOne
    var recipient: User,

    @OneToOne
    var notifiableObject: NotifiableObject? = null,

    @Column(columnDefinition = "bit default 0")
    var isSeen: Boolean = false,
)

