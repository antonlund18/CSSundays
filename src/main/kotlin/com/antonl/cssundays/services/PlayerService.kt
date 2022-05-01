package com.antonl.cssundays.services

import com.antonl.cssundays.model.Player
import com.antonl.cssundays.model.Team
import com.antonl.cssundays.repositories.PlayerRepository
import com.antonl.cssundays.storage.PlayerStorageService
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class PlayerService(val playerRepository: PlayerRepository) {
    fun savePlayer(player: Player) {
        playerRepository.save(player);
    }

    fun createPlayer(username: String, email: String, userId: String): Player {
        val player = Player(username = username, email = email, userId = userId);
        savePlayer(player);
        return player;
    }

    suspend fun uploadPicture(playerId: Int, picturePath: String): Player {
        val player = findPlayerById(playerId);
        deletePicture(playerId);
        val pictureId = PlayerStorageService.uploadImage(picturePath);
        player.picture = pictureId;
        savePlayer(player)
        return player;
    }

    suspend fun deletePicture(playerId: Int): Player {
        val player = findPlayerById(playerId);
        if (!player.picture.equals("")) {
            PlayerStorageService.deleteImage(player.picture);
            player.picture = "";
            savePlayer(player);
        }
        return player;
    }

    fun findPlayerBySlug(slug: String): Player {
        return playerRepository.findPlayerBySlug(slug)
    }

    fun findPlayerById(id: Int): Player {
        return playerRepository.findPlayerById(id)
    }

    fun getAllPlayers(): List<Player> {
        return playerRepository.findAll().toList();
    }

    fun addTeamToPlayer(team: Team, player: Player) {
        if (!team.players.contains(player)) {
            player.teams.add(team);
            savePlayer(player);
        }
    }
}