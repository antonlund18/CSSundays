package com.antonl.cssundays.model.tournaments.brackets.matches

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.model.tournaments.brackets.Match
import java.time.LocalDateTime
import javax.persistence.*

@Entity
@Table(name = "match_chat_message")
class MatchChatMessage(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int? = null,

    @ManyToOne
    val match: Match,

    @ManyToOne
    val sender: User,

    @Column(columnDefinition = "NTEXT")
    val message: String,

    val createdTs: LocalDateTime = LocalDateTime.now()
) {
    init {
        match.chatMessages.add(this)
    }
}