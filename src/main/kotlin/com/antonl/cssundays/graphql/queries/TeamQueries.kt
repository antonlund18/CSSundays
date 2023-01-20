package com.antonl.cssundays.graphql.queries

import com.antonl.cssundays.model.core.Team
import com.antonl.cssundays.services.model.core.TeamService
import com.expediagroup.graphql.server.operations.Query
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class TeamQueries : Query {
    @Autowired
    private lateinit var teamService: TeamService;

    suspend fun getAllTeams(): List<Team> {
        return teamService.findAllTeams();
    }

    suspend fun getTeamById(teamId: Int): Team? {
        return teamService.findTeamById(teamId);
    }
}