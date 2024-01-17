package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.model.core.UserService

class UserNotFoundValidator(val userService: UserService) : Validator() {
    override fun hasError(input: UserMutationInput): Boolean {
        input.id?.let { userService.findUserById(it) } ?: return true
        return true
    }

    override fun getError(): Error {
        return Error.USER_NOT_FOUND
    }
}