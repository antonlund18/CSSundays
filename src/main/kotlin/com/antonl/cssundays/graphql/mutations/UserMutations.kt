package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.graphql.dto.RequestDTO
import com.antonl.cssundays.model.User
import com.antonl.cssundays.services.auth.AuthenticationService
import com.antonl.cssundays.services.model.TeamService
import com.antonl.cssundays.services.model.UserService
import com.expediagroup.graphql.server.operations.Mutation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class UserMutations : Mutation {

    @Autowired
    private lateinit var userService: UserService;

    @Autowired
    private lateinit var teamService: TeamService;

    suspend fun loginUser(email: String, password: String): String  {
        val user = userService.findUserByEmail(email);
        return AuthenticationService.handleLogin(user, password);
    }

    suspend fun createUser(playertag: String, email: String, password: String): String {
        return userService.handleSignUp(playertag, email, password);
    }

    suspend fun deletePicture(userId: Int): User? {
        val user = userService.findUserById(userId) ?: return null
        return userService.deletePicture(user);
    }

    suspend fun addTeamToUser(userId: Int, teamId: Int): User? {
        val user = userService.findUserById(userId);
        val team = teamService.findTeamById(teamId);
        userService.addTeamToUser(team, user);
        return user;
    }
}