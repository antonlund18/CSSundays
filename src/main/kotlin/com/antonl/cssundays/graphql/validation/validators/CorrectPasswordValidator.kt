package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.model.core.UserService

class CorrectPasswordValidator(val userService: UserService) : Validator() {
    override fun hasError(input: UserMutationInput): Boolean {
        val user = input.id?.let { userService.findUserById(it) } ?: return true
        return input.password?.let { !userService.verifyPassword(user, input.password) } ?: return true
    }

    override fun getError(): Error {
        return Error.INCORRECT_PASSWORD
    }

}