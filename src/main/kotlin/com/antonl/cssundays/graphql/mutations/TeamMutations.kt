package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.Team
import com.antonl.cssundays.services.PlayerService
import com.antonl.cssundays.services.TeamService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.stereotype.Component

@Component
class TeamMutations(private val teamService: TeamService, private val playerService: PlayerService) : Mutation {
    fun createTeam(name: String, playerId: Int): Team {
        val player = playerService.findPlayerById(playerId);
        val team = teamService.createTeam(name, player);
        teamService.addPlayerToTeam(player, team);
        return team;
    }
}