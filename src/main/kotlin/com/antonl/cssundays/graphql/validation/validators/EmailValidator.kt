package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.model.core.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class EmailValidator : Validator() {
    @Autowired
    private lateinit var userService: UserService

    override fun hasError(input: UserMutationInput): Boolean {
        return input.email?.let { userService.isValidEmail(it) } ?: true
    }

    override fun getError(): Error {
        return Error.INVALID_EMAIL
    }
}