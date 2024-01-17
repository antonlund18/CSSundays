package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.model.core.UserService

class EmailInUseValidator(val userService: UserService) : Validator() {
    override fun hasError(input: UserMutationInput): Boolean {
        input.email?.let { userService.findUserByEmail(it) } ?: return false
        return true
    }

    override fun getError(): Error {
        return Error.EMAIL_IN_USE
    }
}