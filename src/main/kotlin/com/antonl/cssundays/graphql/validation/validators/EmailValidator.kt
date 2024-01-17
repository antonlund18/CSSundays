package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.auth.AuthenticationService

class EmailValidator : Validator() {
    override fun hasError(input: UserMutationInput): Boolean {
        return input.email?.let { !AuthenticationService.validateEmail(it) } ?: true
    }

    override fun getError(): Error {
        return Error.INVALID_EMAIL
    }
}