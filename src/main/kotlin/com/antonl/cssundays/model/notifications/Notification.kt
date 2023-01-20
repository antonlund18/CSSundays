package com.antonl.cssundays.model.notifications

import com.antonl.cssundays.model.core.User
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "notifications")
class Notification(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = -1,

    @ManyToOne
    var recipient: User,

    @Enumerated(EnumType.STRING)
    var notificationType: NotificationType,

    @OneToOne(cascade = [CascadeType.ALL])
    @JoinColumn(name = "notifiable_object_id", referencedColumnName = "id")
    var notifiableObject: NotifiableObject? = null,

    @Column(columnDefinition = "bit default 0")
    var isSeen: Boolean = false,

    @GeneratedValue
    var createdTs: String = LocalDateTime.now().toString()
)

