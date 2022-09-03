package com.antonl.cssundays.model

import javax.persistence.*

@Entity
@Table(name = "notifications")
class Notification(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = -1,

    @ManyToOne
    var sender: User,

    @ManyToOne
    var recipient: User,

    var type: NotificationType,

    var referenceId: Int? = -1
)

