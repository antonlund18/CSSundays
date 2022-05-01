package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.Player
import com.antonl.cssundays.services.PlayerService
import com.expediagroup.graphql.server.operations.Query
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class PlayerQueries(val playerService: PlayerService) : Query {
    fun getPlayerById(id: Int): Player {
        return playerService.findPlayerById(id);
    }

    fun getAllPlayers(): List<Player> {
        return playerService.getAllPlayers();
    }

    fun getPlayerBySlug(slug: String): Player {
        return playerService.findPlayerBySlug(slug);
    }
}