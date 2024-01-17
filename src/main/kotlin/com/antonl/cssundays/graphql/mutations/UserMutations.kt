package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.graphql.errors.IncorrectPasswordGQLError
import com.antonl.cssundays.graphql.errors.InvalidPasswordGQLError
import com.antonl.cssundays.graphql.errors.PasswordsNotMatchingGQLError
import com.antonl.cssundays.graphql.errors.UserNotFoundGQLError
import com.antonl.cssundays.graphql.validation.validators.UserMutationInput
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.services.auth.AuthenticationService
import com.antonl.cssundays.services.model.core.IncorrectPasswordException
import com.antonl.cssundays.services.model.core.InvalidPasswordException
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.expediagroup.graphql.server.operations.Mutation
import graphql.GraphQLError
import graphql.execution.DataFetcherResult
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

    suspend fun createUser(playertag: String, email: String, password: String, passwordRepeated: String): DataFetcherResult<String?> {
        val input = UserMutationInput(playertag = playertag, email = email, password = password, passwordRepeated = passwordRepeated)
        val validationResult = userService.validateCreateUser(input)

        if (validationResult.getErrors().isNotEmpty()) {
            return DataFetcherResult.newResult<String?>()
            .data(null)
            .errors(validationResult.getGQLErrors())
            .build()
        }

        val jwtToken = userService.handleSignUp(playertag, email, password)
        return DataFetcherResult.newResult<String?>()
            .data(jwtToken)
            .build();
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
            .error(UserNotFoundGQLError())
            .build()

        if (currentPassword.isEmpty() || newPassword.isEmpty() || newPasswordRepeated.isEmpty()) {
            return DataFetcherResult.newResult<User?>()
                .data(null)
                .error(InvalidPasswordGQLError())
                .build()
        }

        val errors = mutableListOf<GraphQLError>()

        if (newPassword != newPasswordRepeated) {
            errors.add(PasswordsNotMatchingGQLError())
        }

        try {
            userService.verifyPassword(user, currentPassword)
        } catch (e: IncorrectPasswordException) {
            errors.add(IncorrectPasswordGQLError())
        }

        try {
            userService.isValidPassword(newPassword)
        } catch (e: InvalidPasswordException) {
            errors.add(InvalidPasswordGQLError())
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