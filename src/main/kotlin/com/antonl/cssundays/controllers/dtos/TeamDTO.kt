package com.antonl.cssundays.controllers.dtos

import com.antonl.cssundays.model.Team
import java.time.LocalDateTime

data class TeamPlayer(
    val id: Long?,
    val username: String,
    val email: String,
    val picture: String,
    val slug: String,
    val createdTs: LocalDateTime,
)

data class TeamDTO(
    val id: Long?,
    val name: String,
    val picture: String,
    val slug: String,
    val createdTs: LocalDateTime,
    val players: List<TeamPlayer>,
)

class TeamConverter {
    companion object {
        fun toDTO(team: Team): TeamDTO {
            return TeamDTO(
                team.id,
                team.name,
                team.picture,
                team.slug,
                team.createdTs,
                team.players.map { player ->
                    TeamPlayer (
                        player.id,
                        player.username,
                        player.email,
                        player.picture,
                        player.slug,
                        player.createdTs,
                    )
                }
            )
        }
    }
}
