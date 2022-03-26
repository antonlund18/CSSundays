package com.antonl.cssundays.controllers.dtos

import com.antonl.cssundays.model.Player
import java.time.LocalDateTime

data class PlayerTeam(
    val id: Long?,
    val name: String,
    val picture: String,
    val slug: String,
    val createdTs: LocalDateTime,
    val owner: Player,
)

data class PlayerDTO(
    val id: Long?,
    val username: String,
    val email: String,
    val picture: String,
    val slug: String,
    val createdTs: LocalDateTime,
    val teams: List<PlayerTeam>,
)

class PlayerConverter {
    companion object {
        fun toDTO(player: Player): PlayerDTO {
            return PlayerDTO(
                player.id,
                player.username,
                player.email,
                player.picture,
                player.slug,
                player.createdTs,
                player.teams.map { team ->
                    PlayerTeam(
                        team.id,
                        team.name,
                        team.picture,
                        team.slug,
                        team.createdTs,
                        team.owner
                    )
                }
            )
        }
    }
}
