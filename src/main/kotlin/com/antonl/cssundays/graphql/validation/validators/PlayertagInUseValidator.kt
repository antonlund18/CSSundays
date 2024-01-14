package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.model.core.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class PlayertagInUseValidator : Validator() {
    @Autowired
    private lateinit var userService: UserService

    override fun hasError(input: UserMutationInput): Boolean {
        input.playertag?.let { userService.findUserByPlayertag(it) } ?: return false
        return true
    }

    override fun getError(): Error {
        return Error.PLAYERTAG_IN_USE
    }
}