package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.services.model.core.SharedTeamAndUserService
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class TeamMutations : Mutation {
    @Autowired
    private lateinit var teamService: TeamService

    @Autowired
    private lateinit var userService: UserService

    @Autowired
    private lateinit var sharedTeamAndUserService: SharedTeamAndUserService

    suspend fun createTeam(name: String, ownerId: Int): Team? {
        val user = userService.findUserById(ownerId) ?: return null
        val team = teamService.createTeam(name, user)
        sharedTeamAndUserService.addUserToTeam(user, team)
        return team;
    }

    suspend fun incrementLosses(teamId: Int): Team? {
        val team = teamService.findTeamById(teamId) ?: return null
        teamService.incrementLosses(team)
        return team;
    }

    suspend fun incrementWins(teamId: Int): Team? {
        val team = teamService.findTeamById(teamId) ?: return null
        teamService.incrementWins(team)
        return team;
    }
}