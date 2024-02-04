package com.antonl.cssundays.graphql.verification.verification

import com.antonl.cssundays.graphql.validation.validators.UserMutationInput
import com.antonl.cssundays.model.errors.Error
import com.antonl.cssundays.services.model.core.UserService

class LoginVerifier(val userService: UserService) : Verifier() {
    override fun hasError(input: UserMutationInput): Boolean {
        val user = input.email?.let { userService.findUserByEmail(it) } ?: return true
        if (user.deletedTs != null) return true
        return input.password?.let { !userService.verifyPassword(user, it) } ?: return true
    }

    override fun getError(): Error {
        return Error.INCORRECT_LOGIN
    }
}