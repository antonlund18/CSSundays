package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.model.errors.Error
import com.antonl.cssundays.services.model.core.UserService

class PlayertagInUseValidator(val userService: UserService) : Validator() {
    override fun hasError(input: UserMutationInput): Boolean {
        input.playertag?.let { userService.findUserByPlayertag(it) } ?: return false
        return true
    }

    override fun getError(): Error {
        return Error.PLAYERTAG_IN_USE
    }
}