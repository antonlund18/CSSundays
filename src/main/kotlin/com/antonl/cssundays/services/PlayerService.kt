package com.antonl.cssundays.services

import com.antonl.cssundays.model.Player
import com.antonl.cssundays.model.Team
import com.antonl.cssundays.repositories.PlayerRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class PlayerService(val playerRepository: PlayerRepository) {
    fun savePlayer(player: Player) {
        playerRepository.save(player);
    }

    fun createPlayer(username: String, email: String): Player {
        val player: Player = Player(username = username, email = email);
        savePlayer(player);
        return player;
    }

    fun findPlayerBySlug(slug: String): Player {
        return playerRepository.findPlayerBySlug(slug)
    }

    fun findPlayerById(id: Int): Player {
        return playerRepository.findPlayerById(id)
    }

    fun addTeamToPlayer(team: Team, player: Player) {
        player.teams.add(team);
        savePlayer(player);
    }
}