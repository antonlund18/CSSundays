package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.Player
import com.antonl.cssundays.services.PlayerService
import com.antonl.cssundays.services.TeamService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.stereotype.Component

@Component
class PlayerMutations(val playerService: PlayerService, val teamService: TeamService) : Mutation {
    fun createPlayer(username: String, email: String, userId: String): Player {
        return playerService.createPlayer(username, email, userId);
    }

    suspend fun uploadPicture(playerId: Int, picturePath: String): Player {
        return playerService.uploadPicture(playerId, picturePath);
    }

    suspend fun deletePicture(playerId: Int): Player {
        return playerService.deletePicture(playerId);
    }

    fun addTeamToPlayer(playerId: Int, teamId: Int): Player {
        val player = playerService.findPlayerById(playerId);
        val team = teamService.findTeamById(teamId);
        playerService.addTeamToPlayer(team, player);
        return player;
    }
}