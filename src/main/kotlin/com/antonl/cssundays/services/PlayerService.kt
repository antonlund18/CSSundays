package com.antonl.cssundays.services

import com.antonl.cssundays.model.Player
import com.antonl.cssundays.repositories.PlayerRepository
import org.springframework.stereotype.Service
import javax.transaction.Transactional

@Service
@Transactional
class PlayerService(val playerRepository: PlayerRepository) {

    fun savePlayer(player: Player) {
        playerRepository.save(player);
    }
}