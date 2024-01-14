package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.model.core.UserService
import org.springframework.beans.factory.annotation.Autowired

class PasswordValidator : Validator() {
    @Autowired
    private lateinit var userService: UserService

    override fun hasError(input: UserMutationInput): Boolean {
        return input.password?.let { userService.isValidPassword(it) } ?: true
    }

    override fun getError(): Error {
        return Error.INVALID_PASSWORD
    }
}