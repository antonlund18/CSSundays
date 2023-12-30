package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.graphql.errors.IncorrectPasswordError
import com.antonl.cssundays.graphql.errors.InvalidPasswordError
import com.antonl.cssundays.graphql.errors.PasswordsNotMatchingError
import com.antonl.cssundays.graphql.errors.UserNotFoundError
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.services.auth.AuthenticationService
import com.antonl.cssundays.services.model.core.IncorrectPasswordException
import com.antonl.cssundays.services.model.core.InvalidPasswordException
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.expediagroup.graphql.server.operations.Mutation
import graphql.ErrorClassification
import graphql.GraphQLError
import graphql.GraphqlErrorBuilder
import graphql.InvalidSyntaxError
import graphql.execution.DataFetcherResult
import graphql.language.SourceLocation
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import javax.transaction.Transactional

@Component
@Transactional
class UserMutations : Mutation {

    @Autowired
    private lateinit var userService: UserService;

    @Autowired
    private lateinit var teamService: TeamService;

    suspend fun loginUser(email: String, password: String): String {
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

    suspend fun updateUser(editUserInput: EditUserInput): User? {
        val user = userService.findUserById(editUserInput.id) ?: return null
        return userService.updatePlayer(user, editUserInput);
    }

    suspend fun changePassword(
        userId: Int,
        currentPassword: String,
        newPassword: String,
        newPasswordRepeated: String
    ): DataFetcherResult<User?> {
        var user = userService.findUserById(userId) ?: return DataFetcherResult.newResult<User?>()
            .data(null)
            .error(UserNotFoundError())
            .build()

        if (currentPassword.isEmpty() || newPassword.isEmpty() || newPasswordRepeated.isEmpty()) {
            return DataFetcherResult.newResult<User?>()
                .data(null)
                .error(InvalidPasswordError())
                .build()
        }

        val errors = mutableListOf<GraphQLError>()

        if (!newPassword.equals(newPasswordRepeated)) {
            errors.add(PasswordsNotMatchingError())
        }

        try {
            userService.verifyPassword(user, currentPassword)
        } catch (e: IncorrectPasswordException) {
            errors.add(IncorrectPasswordError())
        }

        try {
            userService.validatePassword(newPassword)
        } catch (e: InvalidPasswordException) {
            errors.add(InvalidPasswordError())
        }

        if (errors.isEmpty()) {
            user = userService.changePassword(user, newPassword)!!
        }

        return DataFetcherResult.newResult<User?>()
            .data(user)
            .errors(errors)
            .build()
    }
}