package com.antonl.cssundays.graphql.validation.configurations

import com.antonl.cssundays.graphql.validation.validators.*
import com.antonl.cssundays.services.model.core.UserService

class ChangePasswordValidationConfiguration(val userService: UserService)  : ValidationConfiguration {
    private val validators = listOf(
        PasswordValidator(),
        PasswordsNotMatchingValidator(),
        UserNotFoundValidator(userService),
        CorrectPasswordValidator(userService)
    )

    override fun getValidators(): List<Validator> {
        return validators
    }
}