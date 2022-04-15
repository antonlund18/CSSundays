package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.Player
import com.antonl.cssundays.services.PlayerService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.stereotype.Component

@Component
class PlayerMutations(private val playerService: PlayerService) : Mutation {
    fun createPlayer(username: String, email: String): Player {
        return playerService.createPlayer(username, email);
    }
}