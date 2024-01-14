package com.antonl.cssundays.graphql.validation.validators

import com.antonl.cssundays.services.model.core.UserService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class PasswordsNotMatchingValidator : Validator() {
    @Autowired
    private lateinit var userService: UserService

    override fun hasError(input: UserMutationInput): Boolean {
        return input.password != input.passwordRepeated
    }

    override fun getError(): Error {
        return Error.PASSWORDS_NOT_MATCHING
    }

}