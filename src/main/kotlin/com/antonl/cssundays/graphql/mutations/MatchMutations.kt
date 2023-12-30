package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.tournaments.brackets.Match
import com.antonl.cssundays.model.tournaments.brackets.matches.CSMap
import com.antonl.cssundays.services.model.core.UserService
import com.antonl.cssundays.services.model.tournaments.MatchService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class MatchMutations : Mutation {
    @Autowired
    private lateinit var matchService: MatchService

    @Autowired
    private lateinit var userService: UserService

    suspend fun markReady(matchId: Int, playerId: Int): Match? {
        val match = matchService.getMatchById(matchId) ?: return null
        val player = userService.findUserById(playerId) ?: return null
        return matchService.markReady(match, player)
    }

    suspend fun banMap(matchId: Int, playerId: Int, ban: CSMap): Match? {
        val match = matchService.getMatchById(matchId) ?: return null
        val player = userService.findUserById(playerId) ?: return null
        matchService.banMap(match, player, ban)
        return matchService.saveMatch(match)
    }
}