package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.Team
import com.antonl.cssundays.services.model.TeamService
import com.antonl.cssundays.services.model.UserService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class TeamMutations : Mutation {
    @Autowired
    private lateinit var teamService: TeamService;

    @Autowired
    private lateinit var userService: UserService;

    suspend fun createTeam(name: String, userId: Int): Team? {
        val user = userService.findUserById(userId) ?: return null;
        val team = teamService.createTeam(name, user) ?: return null;
        teamService.addPlayerToTeam(user, team);
        return team;
    }

    suspend fun incrementLosses(teamId: Int): Team? {
        val team = teamService.findTeamById(teamId) ?: return null;
        teamService.incrementLosses(team);
        return team;
    }

    suspend fun incrementWins(teamId: Int): Team? {
        val team = teamService.findTeamById(teamId) ?: return null;
        teamService.incrementWins(team);
        return team;
    }
}