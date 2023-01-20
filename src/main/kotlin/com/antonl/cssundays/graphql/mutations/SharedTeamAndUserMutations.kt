package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.graphql.dto.ObjectType
import com.antonl.cssundays.graphql.dto.RequestDTO
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class SharedTeamAndUserMutations : Mutation {

    @Autowired
    private lateinit var userService: UserService;

    @Autowired
    private lateinit var teamService: TeamService;

    suspend fun setPictureAndGetPresignedRequest(id: Int, objectType: ObjectType): RequestDTO? {
        when (objectType) {
            ObjectType.TEAM -> {
                val team = teamService.findTeamById(id) ?: return null
                return teamService.setPicture(team);
            }
            ObjectType.USER -> {
                val user = userService.findUserById(id) ?: return null
                return userService.setPicture(user);
            }
        }
    }
}