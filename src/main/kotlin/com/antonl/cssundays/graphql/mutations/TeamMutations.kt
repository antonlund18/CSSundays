package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.Team
import com.antonl.cssundays.model.User
import com.antonl.cssundays.services.model.UserService
import com.antonl.cssundays.services.model.TeamService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.stereotype.Component

@Component
class TeamMutations(private val teamService: TeamService, private val userService: UserService) : Mutation {
    suspend fun createTeam(name: String, userId: Int): Team? {
        val user = userService.findUserById(userId) ?: return null;
        val team = teamService.createTeam(name, user) ?: return null;
        teamService.addPlayerToTeam(user, team);
        return team;
    }
}