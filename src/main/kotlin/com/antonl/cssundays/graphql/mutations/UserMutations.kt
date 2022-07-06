package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.User
import com.antonl.cssundays.services.auth.AuthenticationService
import com.antonl.cssundays.services.model.TeamService
import com.antonl.cssundays.services.model.UserService
import com.expediagroup.graphql.server.operations.Mutation
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component

@Component
class UserMutations(val userService: UserService, val teamService: TeamService) : Mutation {
    suspend fun loginUser(email: String, password: String): String  {
        val user = userService.findUserByEmail(email);
        return AuthenticationService.handleLogin(user, password);
    }

    suspend fun createUser(environment: DataFetchingEnvironment, playertag: String, email: String, password: String): String {
        return userService.handleSignUp(environment, playertag, email, password);
    }

    suspend fun uploadPicture(playerId: Int, picturePath: String): User? {
        return userService.uploadPicture(playerId, picturePath);
    }

    suspend fun deletePicture(playerId: Int): User? {
        return userService.deletePicture(playerId);
    }

    suspend fun addTeamToUser(userId: Int, teamId: Int): User? {
        val user = userService.findUserById(userId);
        val team = teamService.findTeamById(teamId);
        userService.addTeamToUser(team, user);
        return user;
    }
}