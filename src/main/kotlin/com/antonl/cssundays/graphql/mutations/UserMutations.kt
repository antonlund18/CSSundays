package com.antonl.cssundays.graphql.mutations

import com.antonl.cssundays.graphql.validation.validators.UserMutationInput
import com.antonl.cssundays.model.core.User
import com.antonl.cssundays.services.auth.AuthenticationService
import com.antonl.cssundays.services.model.core.TeamService
import com.antonl.cssundays.services.model.core.UserService
import com.expediagroup.graphql.server.operations.Mutation
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

    suspend fun loginUser(email: String, password: String): DataFetcherResult<String?> {
        val input = UserMutationInput(email = email, password = password)
        val verificationResult = userService.verifyLogin(input)

        if (verificationResult.hasErrors()) {
            return DataFetcherResult.newResult<String?>()
                .data(null)
                .errors(verificationResult.getGQLErrors())
                .build()
        }

        val user = userService.findUserByEmail(email);
        val jwtToken = AuthenticationService.generateJWTToken(user, password)
        return DataFetcherResult.newResult<String>()
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

    suspend fun createUser(playertag: String, email: String, password: String, passwordRepeated: String): DataFetcherResult<String?> {
        val input = UserMutationInput(playertag = playertag, email = email, newPassword = password, newPasswordRepeated = passwordRepeated)
        val validationResult = userService.validateCreateUser(input)

        if (validationResult.hasErrors()) {
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

    suspend fun changePassword(
        userId: Int,
        currentPassword: String,
        newPassword: String,
        newPasswordRepeated: String
    ): DataFetcherResult<User?> {
        val input = UserMutationInput(id = userId, password = currentPassword, newPassword = newPassword, newPasswordRepeated = newPasswordRepeated)
        val validationResult = userService.validateChangePassword(input)

        if (validationResult.hasErrors()) {
            return DataFetcherResult.newResult<User?>()
                .data(null)
                .errors(validationResult.getGQLErrors())
                .build()
        }

        val user = userService.findUserById(userId)!!
        userService.changePassword(user, newPassword)
        return DataFetcherResult.newResult<User?>()
            .data(user)
            .build()
    }
}