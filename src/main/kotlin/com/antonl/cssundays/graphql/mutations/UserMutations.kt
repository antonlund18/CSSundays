package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.services.auth.AuthenticationService
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
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
}