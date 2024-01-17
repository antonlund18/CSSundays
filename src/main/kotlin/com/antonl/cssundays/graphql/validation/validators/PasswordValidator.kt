package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.auth.AuthenticationService

class PasswordValidator : Validator() {
    override fun hasError(input: UserMutationInput): Boolean {
        return input.newPassword?.let { !AuthenticationService.validatePassword(it) } ?: true
    }

    override fun getError(): Error {
        return Error.INVALID_PASSWORD
    }
}