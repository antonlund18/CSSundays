package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.model.errors.Error
import com.antonl.cssundays.services.auth.AuthenticationService

class PlayertagValidator : Validator() {
    override fun hasError(input: UserMutationInput): Boolean {
        return input.playertag?.let { !AuthenticationService.validateUsername(it) } ?: true
    }

    override fun getError(): Error {
        return Error.INVALID_PLAYERTAG
    }
}